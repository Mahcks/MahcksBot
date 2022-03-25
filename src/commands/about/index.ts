import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const exampleCommand: CommandInt = {
  Name: "about",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Displays information about MahcksBot",
  DynamicDescription: [
    "<code>mb about</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[1]);

    sendMessage(channel, `@${target} bot made by Mahcksimus, still a work in progress B)`)
  }
}

export = exampleCommand;