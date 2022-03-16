import axios from "axios";
import Markov from "markov-strings";
import { humanizeNumber, pickNumberBetweenRange } from "../../utils";
import { findQuery } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";

export async function getLoggedChannels() {
  let res = await axios.get("https://logs.ivr.fi/channels");

  let channels: string[] = [];
  res.data.channels.forEach((channel: any) => {
    channels.push(channel.name);
  });

  return channels
}

export async function generateMarkovChain(channel: string, message: string): Promise<string> {
  let loggedChannels: string[] = [];
  const uQuery = await findQuery('SELECT username FROM channels;', []);
  uQuery.forEach((channel: any) => {
    loggedChannels.push(channel.username);
  });

  if (!loggedChannels.includes(channel) && channel !== "all") return `🔮 Sorry I couldn't find any logged messages for that channel.`;
  let qString = (channel === "all") ? 'SELECT message FROM logs ORDER BY RAND() LIMIT 10000;' : 'SELECT message FROM logs WHERE channel=? ORDER BY RAND() LIMIT 10000;';
  let query = await findQuery(qString, (channel === "all") ? [] : [channel.toLowerCase()]);

  let isOver10k = (query.length >= 10000) ? true : false;

  let data: string[] = [];
  query.forEach((msg: any) => {
    data.push(msg.message);
  });

  const markov = new Markov({ stateSize: 1 });
  markov.addData(data);

  const scoreLimit = (isOver10k) ? 50 : pickNumberBetweenRange(5, 15);
  const maxTries = (isOver10k) ? 15000 : 5000;
  const options = {
    maxTries: maxTries,

    filter: (result: any) => {
      return result.string.split(' ').length <= 80 && result.string.split(' ').length >= 15 && !result.string.includes("⣿") && result.score >= scoreLimit;
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
}