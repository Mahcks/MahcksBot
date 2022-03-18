import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/ComandSchema";

const statsCommand: CommandInt = {
  Name: "stats",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Display some random stats.",
  DynamicDescription: [
    "Check how many times a command has been used.",
    "<code>mb stats (command|cmd) (name)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const cmd = context[0];
    const targetChannel = (context[1]) ? context[1] : channel.substring(1);

    if (/(chatlines|lines|messages|msgs)/gi.test(cmd)) {

    } else if (/(command|cmd)/gi.test(cmd)) {
      // Gets how many times a command has been used.
      let used = await findQuery('SELECT count FROM commands WHERE name=?', [context[1]]);
      sendMessage(client, channel, `@${user} that command has been used ${used[0].count} times.`);
    }
  }
}

export = statsCommand;