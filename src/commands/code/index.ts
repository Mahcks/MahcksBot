import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const codeCommand: CommandInt = {
  Name: "code",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Gets the Github page for that specific command.",
  DynamicDescription: [
    "<code>!code (command)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const command = context[0];

    let url = `https://github.com/Mahcks/MahcksBot/blob/main/src/commands/${command.toLowerCase()}/index.ts`;
    sendMessage(channel, `@${user} ${url}`);
  }
}

export = codeCommand;