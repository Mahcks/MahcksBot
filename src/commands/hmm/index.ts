import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { fetchAPI, randomArray } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";
import * as fs from 'fs';
import * as path from 'path';
import reddit from "../../utils/reddit";

const HmmCommand: CommandInt = {
  Name: "hmm",
  Aliases: ["randomtopic"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Displays a random topic to chat about.",
  DynamicDescription: [
    "<code>mb hmm</code>",
    "<code>mb randomtopic</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {


    var chance = Math.random();
    if (chance < 0.3) {
      // 70% chance to get from r/askreddit
      const post = await reddit.getTitle("askreddit");
      if (typeof post === "string") return sendMessage(channel, `@${userstate.username} ${post}`);
      sendMessage(channel, `🤔 ${post.title}`);
    } else {
      let data = fs.readFileSync(path.join(__dirname, `./icebreakers.txt`), 'utf-8');
      let arr = data.toString().replace(/\r\n/g,'\n').split('\n');
      let chosen = randomArray(arr); 
      sendMessage(channel, `🤔 ${chosen}`);
    }
  }
}

export = HmmCommand;