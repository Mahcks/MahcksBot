import axios from "axios";
import Markov from "markov-strings";
import { logPool, redis } from "../../main";
import { humanizeNumber, pickNumberBetweenRange } from "../../utils";
import { findQuery } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { loggedMarkovChannels } from "../channel-logger";

/* 
  TODO LIST
  - [X] Move over the logs on VPS to the one locally.
  - [ ] Cache 40k messages at a time for 1 hour so i don't make make constant requests to sql.
*/

export async function getLoggedChannels() {
  let res = await axios.get("https://logs.ivr.fi/channels");

  let channels: string[] = [];
  res.data.channels.forEach((channel: any) => {
    channels.push(channel.name);
  });

  return channels
}

function getMarkovSpecificChannel(query: string, values: any[]) {
  return new Promise(function (resolve, reject) {
    logPool.query(query, values, (err, result) => {
      if (!err) {
        resolve(result);
      } else {
        reject({
          status: "error",
          message: "Error getting messages",
          debug: err
        });
      }
    });
  });
}

export async function cacheMarkovMessages(key: string) {
  let search = await redis.get(key);
  console.log(search);

  return search;
}

async function getChannelMessages(channel: string, message: string): Promise<string[] | string> {
  let loggedChannels: string[] = [];
  loggedChannels.push(...loggedMarkovChannels);
  const uQuery = await findQuery('SELECT username FROM channels;', []);
  uQuery.forEach((channel: any) => {
    loggedChannels.push(channel.username);
  });

  if (!loggedChannels.includes(channel) && channel !== "all") return `🔮 Sorry I couldn't find any logged messages for that channel.`;

  let toReturn: string[] = [];

  if (loggedMarkovChannels.includes(channel)) {
    // Check if local cache has expired yet or not
    let cache = await redis.get('channel:logs:markov:'+channel);
    if (cache !== null) {
      let parsed = JSON.parse(cache);
      return parsed;
    } else {
      let msgs: any = await getMarkovSpecificChannel(`SELECT message FROM logs.${channel} ORDER BY RAND() LIMIT 15000;`, []);
      msgs.forEach((msg: any) => {
        toReturn.push(msg.message);
      });

      redis.set('channel:logs:markov:'+channel, JSON.stringify(toReturn), 'ex', 3600) // expires in an hour
      return toReturn;
    }

  } else {
    let qString = (channel === "all") ? 'SELECT message FROM logs ORDER BY RAND() LIMIT 10000;' : 'SELECT message FROM logs WHERE channel=? ORDER BY RAND() LIMIT 10000;';
    let query = await findQuery(qString, (channel === "all") ? [] : [channel.toLowerCase()]);
    query.forEach((msg: any) => {
      toReturn.push(msg.message);
    });
  }

  return toReturn;
}

export async function generateMarkovChain(channel: string, message: string): Promise<string> {
  let data = await getChannelMessages(channel, message);
  let isOver10k = (data.length >= 10000) ? true : false;

  const markov = new Markov({ stateSize: 1 });

  if (Array.isArray(data)) {
    markov.addData(data);

    const scoreLimit = (isOver10k) ? 50 : pickNumberBetweenRange(5, 15);
    const maxTries = (isOver10k) ? 15000 : 5000;
    const options = {
      maxTries: maxTries,

      filter: (result: any) => {
        return result.string.split(' ').length <= 80 && result.string.split(' ').length >= 8 && !result.string.includes("⣿") && result.score >= scoreLimit;
      }
    }

    try {
      const result = markov.generate(options);
      let msg: string = '';
      let isUrl: RegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
      (/-stats/gm.test(message)) ? msg = `[Tries: ${result.tries} | Refs: ${result.refs.length} | Score: ${result.score}]🔮 ${result.string.replace(isUrl, '[Redacted-URL]')}` : msg += `🔮 ${result.string.replace(isUrl, '[Redacted-URL]')}`;
      return msg
    } catch (err) {
      let total = await findQuery('SELECT COUNT(*) FROM logs WHERE channel=?;', [channel]);
      if (total[0]['COUNT(*)'] <= 5000) {
        let currentSettings = await getChannelSettings(channel);
        return `🔮 Error generating Markov chain after ${humanizeNumber(options.maxTries)} tries. It may be because this channel only has ${humanizeNumber(total[0]['COUNT(*)'])} messages logged. If you still want to use this command use "${currentSettings.prefix} markov all"`;
      } else return `🔮 Error generating Markov chain after ${humanizeNumber(options.maxTries)} tries. Please try again later.`;
    }
  } else return data;
}