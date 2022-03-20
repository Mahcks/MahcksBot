import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const commandsCommand: CommandInt = {
  Name: "commands",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Shows all the commands.",
  DynamicDescription: [
    "<code>!commands (optional: user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const target = getTarget(user, context[0]);

    sendMessage(channel, `@${target} Commands are available here: https://www.mahcks.com/mb/commands`);
  }
}

export = commandsCommand;