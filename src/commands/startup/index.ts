import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const StartUpCommand: CommandInt = {
  Name: "startup",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Generates a random startup idea.",
  DynamicDescription: [
    "<code>mb startup</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    let req = await axios.get("https://itsthisforthat.com/api.php?json");
    sendMessage(channel, `@${user}, I have a business proposal... ${req.data.this} for ${req.data.that}`);
  }
}

export = StartUpCommand;