import axios from "axios";
import Markov from "markov-strings";
import { redis } from "../../main";
import { checkMessageBanPhrase, humanizeNumber, pickNumberBetweenRange, postHastebin } from "../../utils";
import { findQuery, logQuery } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { loggedMarkovChannels } from "../channel-logger";
import { generateMarkov } from "../markov-generator";

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

  if (channel === "channels") {
    let loggedChannels: string[] = [];
    let test: any = await logQuery('SHOW TABLES FROM logs;', []);
    test.forEach((ch: any) => {
      loggedChannels.push(ch['Tables_in_logs']);
    });

    let haste = await postHastebin(`Avilable channels for Markov command:\n${loggedChannels.sort().join("\n")}`);
    return `🔮 Avilable channels listed here: ${haste}`;
  }

  if (!loggedChannels.includes(channel) && channel !== "all") return `🔮 Sorry I couldn't find any logged messages for that channel.`;

  let toReturn: string[] = [];

  /* if (loggedMarkovChannels.includes(channel)) { */
    // Check if local cache has expired yet or not
    let cache = await redis.get('channel:logs:markov:' + channel);
    if (cache !== null) {
      let parsed = JSON.parse(cache);
      return parsed;
    } else {

      try {
        let msgs: any = await logQuery(`SELECT message FROM logs.${channel} WHERE username != 'okayegbot' AND username != 'egsbot' AND username != 'supibot' AND username != 'thepositivebot' AND username != 'huwobot' AND username != 'streamelements' ORDER BY RAND() LIMIT 15000;`, []);
        msgs.forEach((msg: any) => {
          toReturn.push(msg.message);
        });
  
        redis.set('channel:logs:markov:' + channel, JSON.stringify(toReturn), 'ex', 3600) // expires in an hour
        return toReturn;
      } catch (err) {
        console.log(err);
      }
    }

  /* } else {
    let qString = (channel === "all") ? 'SELECT message FROM logs ORDER BY RAND() LIMIT 10000;' : 'SELECT message FROM logs WHERE channel=? ORDER BY RAND() LIMIT 10000;';
    let query = await findQuery(qString, (channel === "all") ? [] : [channel.toLowerCase()]);
    query.forEach((msg: any) => {
      toReturn.push(msg.message);
    });
  } */

  return toReturn;
}

async function testGenerate(messages: string[]): Promise<string> {
  
  let result;
  do {
    result = generateMarkov({
      wordsCount: pickNumberBetweenRange(10, 40),
      sampleSize: 6,
      source: messages
    });
  }
  while (/(http:|https:|⣿)/gm.test(result));

  return result.replace(/,/gi, ' ');
}

export async function generateMarkovChain(channel: string, message: string): Promise<string> {
  let data = await getChannelMessages(channel, message);
  
  if (/-dank/gm.test(message)) {
    if (Array.isArray(data)) {
      let chain = await testGenerate(data);
      return `FeelsDankMan 🔮 ${chain}`;
    } 
  }

  let isOver10k = (data.length >= 10000) ? true : false;

  const markov = new Markov({ stateSize: 2 });

  if (Array.isArray(data)) {
    markov.addData(data);

    const scoreLimit = (isOver10k) ? 70 : pickNumberBetweenRange(5, 15);
    const maxTries = (isOver10k) ? 15000 : 5000;
    const options = {
      maxTries: maxTries,

      filter: (result: any) => {
        return result.string.split(' ').length <= 80 
        && result.string.split(' ').length >= 10 
        && !result.string.includes("⣿")
        && !result.string.includes("http:")
        && !result.string.includes("https:") 
        && result.score >= scoreLimit;
      }
    }

    try {
      const result = markov.generate(options);
      let msg: string = '';
      let isUrl: RegExp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
      (/-stats/gm.test(message)) ? msg = `[Tries: ${result.tries} | Refs: ${result.refs.length} | Score: ${result.score}]🔮 ${result.string.replace(isUrl, '[Redacted-URL]')}` : msg += `🔮 ${result.string.replace(isUrl, '[Redacted-URL]')}`;

      let monkaLaugh = await checkMessageBanPhrase(msg);
      if (monkaLaugh === null) return '🔮 Error checking for banphrases.';
      if (/(i'm\s12|im\s12|i\sam\s12|am\s12)/gm.test(message)) return `🔮 [REDACTED] cmonBruh`;
      if (monkaLaugh) return `🔮 [REDACTED] cmonBruh`;

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
