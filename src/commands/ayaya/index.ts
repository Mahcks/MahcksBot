import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { randomArray } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const exampleCommand: CommandInt = {
  Name: "ayaya",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "AYAYA Clap",
  DynamicDescription: [
    "<code>!ayaya</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let rand = randomArray([
      'waifu',
      'neko',
      'shinobu',
      'megumin',
      'bully',
      'cuddle',
      'cry',
      'hug',
      'awoo',
      'kiss',
      'lick',
      'pat',
      'smug',
      'bonk',
      'yeet',
      'blush',
      'wave',
      'highfive',
      'handhold',
      'nom',
      'bite',
      'glomp',
      'slap',
      'kill',
      'kick',
      'happy',
      'wink',
      'poke',
      'dance',
      'cringe'
    ]);

    try {
      let res = await axios.get(`https://api.waifu.pics/sfw/${rand}`);
      sendMessage(client, channel, `@${user} ${res.data.url}`);
    } catch (err) {
      sendMessage(client, channel, `@${user} sorry there was an API issue, try again later FeelsDankMan`);
    }
  }
}

export = exampleCommand;