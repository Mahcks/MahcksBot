import { Actions, CommonUserstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery, updateOne } from "../../utils/maria";
import { getChannelSettings, updateChannelCache } from "../../utils/start";
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
    const user = userstate['display-name'];
    let cmdTarget = context[0].toLowerCase();
    let currentSettings = getChannelSettings(channel.substring(1));
    if (!cmdTarget) return sendMessage(client, channel, `@${user} please provide a command to disable. ${currentSettings.prefix}disable (command)`);

    // TODO: add support to disable multiple commands like '!disable cmd1 cmd2 cmd3'

    let query = await findQuery('SELECT * FROM channels WHERE id=?', [userstate['user-id']]);
    let currDisabled: any[] = JSON.parse(query[0].disabledCommands);

    let qCmd = await findQuery('SELECT * FROM commands WHERE name=?', [cmdTarget]);
    let found = qCmd[0];

    if (found) {
      if (!currDisabled.includes(cmdTarget)) {
        let cantDisable = ['ping', 'disable', 'enable'];
        if (cantDisable.includes(cmdTarget)) return sendMessage(client, channel, `@${user} you can't disable that command.`);

        // Update cache
        currDisabled.push(cmdTarget);
        updateChannelCache(parseInt(userstate['user-id']!), "disabledCommands", currDisabled);

        await updateOne('UPDATE channels SET disabledCommands=? WHERE id=?;', [JSON.stringify(currDisabled), userstate['user-id']]);
        sendMessage(client, channel, `@${user} disabled the command "${cmdTarget}"`)
      } else return sendMessage(client, channel, `@${user} "${cmdTarget}" is already disabled. To enable it do ${currentSettings.prefix}enable ${cmdTarget}`);
    } else return sendMessage(client, channel, `@${user} can't find the command "${cmdTarget}" to disable.`); 
  }
}

export = disableCommand;