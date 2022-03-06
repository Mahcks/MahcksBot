import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery, updateOne } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const optinCommand: CommandInt = {
  Name: "optin",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Optin commands that you opted out of before.",
  DynamicDescription: [
    "<code>!optin (command)</code>"
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
    if (!cmdSearch) return sendMessage(client, false, channel, `@${user} please provide a command to optout of: ${currSettings.prefix}optout (command)`);
    if (checkCommand[0]) {
      let canOptout = Boolean(checkCommand[0].optout);
      if (!canOptout) return sendMessage(client, false, channel, `@${user} can't optout/optin for that command.`);
    
      let isUser = await findQuery('SELECT * FROM optout WHERE id=?', [userstate['user-id']]);
      if (isUser[0]) {
        let optedOut = JSON.parse(isUser[0].commands);
        if (optedOut.includes(cmdSearch.toLowerCase())) {
          // remove from array and update it with the new array.
          let index = optedOut.indexOf(cmdSearch.toLowerCase());
          optedOut.splice(index, 1);
          await updateOne('UPDATE optout SET commands=? WHERE id=?;', [JSON.stringify(optedOut), userstate['user-id']]);
          sendMessage(client, false, channel, `@${user} you have opted into ${cmdSearch.toLowerCase()}.`);
        } else {
          sendMessage(client, false, channel, `@${user} you are already opted in for that command. If you'd like to optout do: ${currSettings.prefix}optout ${cmdSearch.toLowerCase()}`);
        }
      } else {
        sendMessage(client, false, channel, `@${user} you are already opted in for that command. If you'd like to optout do: ${currSettings.prefix}optout ${cmdSearch.toLowerCase()}`);
      }
    } else return sendMessage(client, false, channel, `@${user} couldn't find the command "${cmdSearch.toLowerCase()}"`);
  }
}

export = optinCommand;