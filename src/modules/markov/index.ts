import axios from "axios";
import Markov from "markov-strings";
import { humanizeNumber, pickNumberBetweenRange } from "../../utils";
import { findQuery } from "../../utils/maria";

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

  if (!loggedChannels.includes(channel)) return `🔮 Sorry I couldn't find any logged messages for that channel.`;
  let query = await findQuery('SELECT message FROM logs WHERE channel=? ORDER BY RAND() LIMIT 10000;', [channel.toLowerCase()]);
  
  let isOver10k = (query.length >= 10000) ? true : false;

  let data: string[] = [];
  query.forEach((msg: any) => {
    data.push(msg.message);
  });

  const markov = new Markov({ stateSize: 2 });
  markov.addData(data);

  const scoreLimit = (isOver10k) ? 50 : pickNumberBetweenRange(5, 15);
  const maxTries = (isOver10k) ? 10000 : 5000;
  const options = {
    maxTries: maxTries,

    filter: (result: any) => {
      return result.string.split(' ').length <= 80 && !result.string.includes("⣿") && result.score >= scoreLimit;
    }
  }

  try {
    const result = markov.generate(options);
    let msg: string = '';
    (/-stats/gm.test(message)) ? msg = `[Tries: ${result.tries} | Refs: ${result.refs.length} | Score: ${result.score}]🔮 ${result.string}` : msg = `🔮 ${result.string}`;
    return msg
  } catch (err) {
    return `🔮 Error generating Markov chain after ${humanizeNumber(options.maxTries)} tries. Please try again later.`;
  }
}