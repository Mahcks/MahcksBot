import { Actions, Userstate } from "tmi.js";
import { updateBanphrases } from "../../modules/ban-phrase";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const reloadCommand: CommandInt = {
  Name: "reload",
  Aliases: [],
  Permissions: ["developer"],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Development purposes only.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const cmd = context[0];

    if (cmd === "banphrase" || cmd === "bp") {
      await updateBanphrases();
      return sendMessage(channel, `@${user} refreshed banphrases BroBalt`);
    }
  }
}

export = reloadCommand;