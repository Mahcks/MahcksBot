import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery, insertRow } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const optoutCommand: CommandInt = {
  Name: "optout",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Optout from any optoutable commands.",
  DynamicDescription: [
    "<code>mb optout (command)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let cmdSearch = context[0];
    
    let currSettings = await getChannelSettings(channel);

    let checkCommand = await findQuery('SELECT * FROM commands WHERE name=?;', [cmdSearch]);
    if (!cmdSearch) return sendMessage(channel, `@${user} please provide a command to optout of: ${currSettings.prefix}optout (command)`);
    if (checkCommand[0]) {
      let canOptout = Boolean(checkCommand[0].optout);
      if (!canOptout) return sendMessage(channel, `@${user} can't optout of that command.`);
      
      let isUser = await findQuery('SELECT * FROM optout WHERE id=? AND command=?', [userstate['user-id'], cmdSearch.toLowerCase()]);
      if (isUser[0]) {
          sendMessage(channel, `@${user} already opted out of ${cmdSearch.toLowerCase()}. If you'd like to opt back in use ${currSettings.prefix}optin ${cmdSearch.toLowerCase()}`);
      } else {
        await insertRow('INSERT INTO optout (id, username, command) VALUES (?, ?, ?);', [userstate['user-id'], userstate.username, cmdSearch.toLowerCase()]);
        sendMessage(channel, `@${user} opted out of ${cmdSearch.toLowerCase()}`);
      }

    } else return sendMessage(channel, `@${user} couldn't find the command "${cmdSearch}"`);
  }
}

export = optoutCommand;