import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/ComandSchema";

const disableCommand: CommandInt = {
  Name: "",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    
  }
}

export = disableCommand;