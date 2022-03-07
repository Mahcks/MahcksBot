import { Actions, Userstate } from "tmi.js";
import { CommandInt } from "../../validation/ComandSchema";

const devCommand: CommandInt = {
  Name: "developer",
  Aliases: ['dev'],
  Permissions: ['developer'],
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
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    
  }
}

export = devCommand;