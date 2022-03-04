import { Actions, CommonUserstate } from "tmi.js";
import { findQuery } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const helpCommand: CommandInt = {
  Name: "help",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get commands URL or info about a specific command.",
  DynamicDescription: [
    "<code>!help</code>",
    "",
    "Get help for a specific command.",
    "<code>!help (command)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    const user = userstate['username'];
    let search = context[0];
    let command = await findQuery('SELECT * FROM commands WHERE name=? LIMIT 1;', [search]);
    let channelSettings = getChannelSettings(channel);
    
    if (search) {
      if (command[0]) {
        command = command[0];
        let aliasParse = JSON.parse(command["aliases"]);
        let aliases = (aliasParse.length) ? aliasParse.map((s: string) => channelSettings.prefix + s).join(', ') : 'No aliases';
        client.action(channel, `@${user} ${channelSettings.prefix}${command['name']} (${aliases}): ${command["description"]} - ${command['cooldown']}sec cooldown.`);
      } else client.action(channel, `@${user} couldn't find a command with the name "${search}"`);
    } else client.action(channel, `@${user} Commands and more information avilable here: [TODO]`);
  }
}

export = helpCommand;