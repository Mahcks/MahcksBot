import { Actions, CommonUserstate } from "tmi.js";
import { findOne, findQuery, updateOne } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const disableCommand: CommandInt = {
  Name: "disable",
  Aliases: [],
  Permissions: ['broadcaster'],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Disable a command.",
  DynamicDescription: [
    "<code>!disable (command)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    let cmdTarget = context[0];
    let currentSettings = getChannelSettings(channel.substring(1));

    let query = await findQuery('SELECT * FROM channels WHERE id=?', [userstate['user-id']]);
    let currDisabled = JSON.parse(query[0].disabledCommands);

    console.log(currDisabled);
    let qCmd = await findQuery('SELECT * FROM commands WHERE name=?', [cmdTarget]);
    if (qCmd[0]) {
      if (!currDisabled.includes(cmdTarget) || currDisabled.length === 0) {
        
        console.log(JSON.stringify(["test"]));
        //await updateOne('UPDATE channels SET disabledCommands=? WHERE id=?', [currDisabled.push(cmdTarget.toLowerCase()), userstate['user-id']]);
      } else return client.action(channel, `@${userstate['display-name']} that command is already disabled. To enable it use ${currentSettings.prefix}enable ${cmdTarget}`);
    } else {
      return client.action(channel, `@${userstate['display-name']} the command "${cmdTarget}" doesn't exist.`);
    }
  }
}

export = disableCommand;