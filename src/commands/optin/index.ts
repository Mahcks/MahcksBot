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
    if (!cmdSearch) return sendMessage(client, channel, `@${user} please provide a command to optout of: ${currSettings.prefix}optout (command)`);
    if (checkCommand[0]) {
      let canOptout = Boolean(checkCommand[0].optout);
      if (!canOptout) return sendMessage(client, channel, `@${user} can't optout/optin for that command.`);
    
      let isUser = await findQuery('SELECT * FROM optout WHERE id=? AND command=?', [userstate['user-id'], cmdSearch.toLowerCase()]);
      if (isUser[0]) {
          // remove from array and update it with the new array.
          await findQuery('DELETE FROM optout WHERE id=? AND command=?', [userstate["user-id"], cmdSearch.toLowerCase()]);
          sendMessage(client, channel, `@${user} you have opted into ${cmdSearch.toLowerCase()}.`);
      } else {
        sendMessage(client, channel, `@${user} you are already opted in for that command. If you'd like to optout do: ${currSettings.prefix}optout ${cmdSearch.toLowerCase()}`);
      }
    } else return sendMessage(client, channel, `@${user} couldn't find the command "${cmdSearch.toLowerCase()}"`);
  }
}

export = optinCommand;