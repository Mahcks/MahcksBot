import { Actions, CommonUserstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery, updateOne } from "../../utils/maria";
import { getChannelSettings, updateChannelCache } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const enableCommand: CommandInt = {
  Name: "enable",
  Aliases: [],
  Permissions: ['broadcaster'],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Enable a command.",
  DynamicDescription: [
    "<code>!enable (command)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    const user = userstate['username'];
    let cmdTarget = context[0];
    let currentSettings = getChannelSettings(channel.substring(1));
    if (!cmdTarget) return sendMessage(client, channel, `@${user} please provide a command to enable. ${currentSettings.prefix}enable (command)`);

    // TODO: add support to disable multiple commands like '!enable cmd1 cmd2 cmd3'

    let query = await findQuery('SELECT * FROM channels WHERE id=?', [userstate['user-id']]);
    let currDisabled: any[] = JSON.parse(query[0].disabledCommands);

    let qCmd = await findQuery('SELECT * FROM commands WHERE name=?', [cmdTarget]);
    let found = qCmd[0];

    if (found) {
      if (currDisabled.includes(cmdTarget)) {
        // Remove command from disabled list.
        let index = currDisabled.indexOf(cmdTarget.toLowerCase());
        currDisabled.splice(index, 1);

        // Update cache.
        updateChannelCache(parseInt(userstate['user-id']!), "disabledCommands", currDisabled);

        // Update table.
        await updateOne('UPDATE channels SET disabledCommands=? WHERE id=?;', [JSON.stringify(currDisabled), userstate['user-id']]);
        sendMessage(client, channel, `@${user} enabled the command "${cmdTarget}"`);
      } else return sendMessage(client, channel, `@${user} "${cmdTarget}" is enabled. If you'd like to disable it do ${currentSettings.prefix}disable ${cmdTarget}`);
    } else return sendMessage(client, channel, `@${user} can't find the command "${cmdTarget}" to enable.`); 
  }
}

export = enableCommand;