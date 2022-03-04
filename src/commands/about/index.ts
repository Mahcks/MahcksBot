import { Actions, CommonUserstate } from "tmi.js";
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
    "<code>!about</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    const user = userstate["display-name"];
    let target = getTarget(user, context[1]);

    client.action(channel, `@${target} bot made by Mahcksimus, still a work in progress B)`);
  }
}

export = exampleCommand;