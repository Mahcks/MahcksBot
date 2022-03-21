import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { humanizeNumber } from "../../utils";
import { findQuery, logQuery } from "../../utils/maria";
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
    "<code>mb stats (command|cmd) (name)</code>",
    "",
    "Tells you how many messages have been logged in a logged channel. If no channel given it will do the current channel.",
    "<code>mb stats (channel)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const cmd = context[0];

    if (/(chatlines|lines|messages|msgs)/gi.test(cmd)) {

    } else if (/(command|cmd)/gi.test(cmd)) {
      // Gets how many times a command has been used.
      let used = await findQuery('SELECT count FROM commands WHERE name=?', [context[1]]);
      sendMessage(channel, `@${user} that command has been used ${used[0].count} times.`);
    
    } else if (/(channel)/gi.test(cmd)) {
      let targetChannel = (context[1]) ? context[1].replace('@', '') : channel.substring(1);
      let total = await logQuery(`SELECT COUNT(*) FROM logs.${targetChannel.toLowerCase()};`, []);
      sendMessage(channel, `@${user} total messages logged: ${humanizeNumber(total[0]["COUNT(*)"])}`);
    }
  }
}

export = statsCommand;