import { Actions, CommonUserstate, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { removeFirstWord } from "../../utils";
import { findQuery, insertRow } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const suggestCommand: CommandInt = {
  Name: "suggest",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Submit a suggestion for the bot.",
  DynamicDescription: [
    "Send a suggestion.",
    "<code>mb suggestion (send) (message)</code>",
    "",
    "Check a specific ID for the status.",
    "<code>mb suggestion check (ID)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let suggestion = context.join(" ");
    let tableCount = await findQuery('SELECT COUNT(*) FROM suggestions', []);
    let count = tableCount[0]['COUNT(*)'];
    let currentSettings = await getChannelSettings(channel);

    if (context[0]) {
      if (context[0] === "send") {
        let idea = removeFirstWord(suggestion);

        let newCount = count+1;
        await insertRow('INSERT INTO suggestions (id, uid, username, message, status) VALUES (?, ?, ?, ?, ?);', [newCount, userstate['user-id'], userstate['username'], idea, 'pending']);
        return sendMessage(channel, `@${userstate['username']} suggestion submitted with ID ${newCount}`)
      
      } else if (context[0] === "check") {
        let found = await findQuery('SELECT * FROM suggestions WHERE id=?', [context[1]]);
        if (found[0]) {
          return sendMessage(channel, `@${userstate.username} message: ${found[0].message} status: ${found[0].status}`);
        } else return sendMessage(channel, `@${userstate.username} couldn't find a suggestion with that ID`);
      }
    } else {
      let query = await findQuery('SELECT COUNT(*) FROM suggestions WHERE uid=?', [userstate['user-id']]);
      let total = (query[0]) ? query[0]['COUNT(*)'] : 0;
      sendMessage(channel, `@${userstate.username} you have submitted ${total} suggestions. If you'd like to send feedback use: ${currentSettings.prefix}suggest (send/check) (message/id)`);
    }
  }
}

export = suggestCommand;