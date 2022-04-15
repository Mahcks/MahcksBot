import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { fetchAPI } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const HmmCommand: CommandInt = {
  Name: "hmm",
  Aliases: ["randomtopic"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Displays a random topic to chat about.",
  DynamicDescription: [
    "<code>mb hmm</code>",
    "<code>mb randomtopic</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const req = await fetchAPI("https://www.conversationstarters.com/random.php");
    if (req.error) return sendMessage(channel, `@${userstate.username} ${req.defaultMessage}`);

    sendMessage(channel, `🤔 ${req.data.replace("<img src=bullet.gif width=17 height=16>", "")}`);
  }
}

export = HmmCommand;