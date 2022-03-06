import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery, insertRow, updateOne } from "../../utils/maria";
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
    "<code>!optout (command)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate['username'];
    let cmdSearch = context[0];
    
    let currSettings = getChannelSettings(channel);

    let checkCommand = await findQuery('SELECT * FROM commands WHERE name=?;', [cmdSearch]);
    if (!cmdSearch) return sendMessage(client, channel, `@${user} please provide a command to optout of: ${currSettings.prefix}optout (command)`);
    if (checkCommand[0]) {
      let canOptout = Boolean(checkCommand[0].optout);
      if (!canOptout) return sendMessage(client, channel, `@${user} can't optout of that command.`);
      
      let isUser = await findQuery('SELECT * FROM optout WHERE id=?', [userstate['user-id']]);
      if (isUser[0]) {
        let optedOut = JSON.parse(isUser[0].commands);
        if (optedOut.includes(cmdSearch.toLowerCase())) {
          sendMessage(client, channel, `@${user} already opted out of ${cmdSearch.toLowerCase()}. If you'd like to opt back in use ${currSettings.prefix}optin ${cmdSearch.toLowerCase()}`);
        } else {
          optedOut.push(cmdSearch.toLowerCase());
          await updateOne('UPDATE optout SET commands=? WHERE id=?;', [JSON.stringify(optedOut), userstate['user-id']]);
          sendMessage(client, channel, `@${user} opted out of ${cmdSearch.toLowerCase()}`);
        }
      } else {
        await insertRow('INSERT INTO optout (id, commands) VALUES (?, ?);', [userstate['user-id'], JSON.stringify([cmdSearch.toLowerCase()])]);
        sendMessage(client, channel, `@${user} opted out of ${cmdSearch.toLowerCase()}`);
      }

    } else return sendMessage(client, channel, `@${user} couldn't find the command "${cmdSearch}"`);
  }
}

export = optoutCommand;