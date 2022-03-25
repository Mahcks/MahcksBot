import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const randompingCommand: CommandInt = {
  Name: "randomping",
  Aliases: ['rping'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Ping random people from chat.",
  DynamicDescription: [
    "<code>mb randomping</code>",
    "<code>mb rping</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: true,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let users = ['mahcksimus', 'test1', 'test2', 'test3'];
    sendMessage(channel, `${users.join(", ")}`);
    
  }
}

export = randompingCommand;