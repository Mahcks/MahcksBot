import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTarget } from "../../utils";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const commandsCommand: CommandInt = {
  Name: "commands",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Shows all the commands.",
  DynamicDescription: [
    "<code>!commands</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const target = getTarget(user, context[0]);

    let currSettings = getChannelSettings(channel);
    sendMessage(client, channel, `@${target} sorry, I don't have a command page yet. If you'd like to get a brief description of a command use ${currSettings.prefix}about (command). Or view the source code with ${currSettings.prefix}code (command) It'll be at the top of the file.`);
  }
}

export = commandsCommand;