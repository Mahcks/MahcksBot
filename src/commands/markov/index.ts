import Markov from "markov-strings";
import { Actions, Userstate } from "tmi.js";
import { generateMarkovChain } from "../../modules/markov";
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

    let msg = await generateMarkovChain(targetChannel, context.join(" "));
    sendMessage(client, channel, msg);
  }
}

export = markovCommand;