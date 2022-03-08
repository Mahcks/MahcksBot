import { Actions, Userstate } from "tmi.js";
import { CommandInt } from "../../validation/ComandSchema";

const pilzCommand: CommandInt = {
  Name: "pilzkman",
  Aliases: ["pilz"],
  Permissions: ['developer'],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "For pilz.",
  DynamicDescription: [
    "<code>!pilz</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    if (userstate["user-id"] === '61797034' || userstate['user-id'] === "237509153") {
      let cmd = context[0];
      if (cmd === "cancer") {
        let res = '';
        for (let xd = 1; xd <= 500; xd++) {
          res += String.fromCharCode(Math.floor(Math.random() * 1114111));
        }
        client.say(channel, res);
      }
    } else return;
  }
}

export = pilzCommand;