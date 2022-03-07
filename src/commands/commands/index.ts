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

    sendMessage(client, channel, `@${target} https://github.com/Mahcks/MahcksBot`);
  }
}

export = commandsCommand;