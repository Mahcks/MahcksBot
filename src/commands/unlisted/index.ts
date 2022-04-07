import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { randomArray } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";
import * as cheerio from "cheerio";

const unlistedCommand: CommandInt = {
  Name: "unlisted",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Grabs one of the top 100 streams in the unlisted category.",
  DynamicDescription: [
    "<code>mb unlisted</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    const req = await axios.get("https://api.retpaladinbot.com/twitch/unlisted");
    let random = randomArray(req.data.data);
    let isMature = (random.isMature) ? "[MATURE]" : "";

    sendMessage(channel, `@${user} ${isMature} ${random.title} [${random.viewerCount} viewers] - https://twitch.tv/${random.username}`);
  }
}

export = unlistedCommand;