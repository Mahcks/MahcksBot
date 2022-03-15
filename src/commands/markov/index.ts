import Markov from "markov-strings";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/ComandSchema";

const markovCommand: CommandInt = {
  Name: "markov",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Generates a markov chain.",
  DynamicDescription: [
    "If no channel is provided it targets the default channel it's in.",
    "<code>mb markov (channel)</code>",
    "",
    "If you'd like to see how the bot created it with amount of tries, refrences, and score use '-stats' at the end.",
    "<code>mb markov -stats"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let targetChannel = (context[0]) ? context[0] : channel.substring(1);
    targetChannel = (targetChannel.startsWith("-")) ? channel.substring(1) : targetChannel;

    let query = await findQuery('SELECT message FROM logs WHERE channel=? ORDER BY RAND() LIMIT 10000;', [targetChannel]);

    if (!query[0]) return sendMessage(client, channel, `🔮 Sorry I couldn't find any logged messages that channel.`);

    let data: string[] = [];
    query.forEach((msg: any) => {
      data.push(msg.message);
    });

    // TODO: Exclude any ASCII art
    const markov = new Markov({ stateSize: 2 });
    markov.addData(data);

    const options: any = {
      maxTries: 2000,

      filter: (result: any) => {
        return result.string.split(' ').length <= 30 && !result.string.includes("⣿") && result.score >= 50
      }
    }

    const result = markov.generate(options);
    let msg: string = '';
    (/-stats/gm.test(context.join(" "))) ? msg = `[Tries: ${result.tries} | Refs: ${result.refs.length} | Score: ${result.score}]🔮 ${result.string}` : msg = `🔮 ${result.string}`;
    sendMessage(client, channel, msg);
  }
}

export = markovCommand;