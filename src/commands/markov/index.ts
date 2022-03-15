import Markov from "markov-strings";
import { Actions, Userstate } from "tmi.js";
import { generateMarkovChain } from "../../modules/markov";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/ComandSchema";
import Genius from "genius-lyrics";
import config from "../../config/config";

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
    "To generate a Markov chain based on song writers, use the following:",
    "<code>mb markov lyrics (songs seperated by ',')",
    "",
    "If you'd like to see how the bot created it with amount of tries, refrences, and score use '-stats' at the end.",
    "<code>mb markov -stats</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let targetChannel = (context[0]) ? context[0] : channel.substring(1);
    targetChannel = (targetChannel.startsWith("-")) ? channel.substring(1) : targetChannel;

    /* let searchingLyrics = /(lyric|lyrics|music)/gi.test(targetChannel);
    if (searchingLyrics) {
      const gClient = new Genius.Client();
      context.shift();
      if (context.length > 1) {
        let found: string[] = [];
        let songs = context.join(" ").split(",");

        for (const song of songs) {
          let search = await gClient.songs.search(song);
          let foundFirst = search[0];
          let lyrics = await foundFirst.lyrics();
          found.push(lyrics);
        }

        console.log(found);
      } else console.log('only one song');
      return
    } */

    let msg = await generateMarkovChain(targetChannel, context.join(" "));
    sendMessage(client, channel, msg);
  }
}

export = markovCommand;