import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { calcDate, getTarget } from "../../utils";
import { getUserId } from "../../utils/helix";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/ComandSchema";

interface UserChannelBans {
  totalBans: number;
  latestBan: Date;
}

const isbannedCommand: CommandInt = {
  Name: "isbanned",
  Aliases: ['bancheck'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check if a user is banned.",
  DynamicDescription: [
    "By default it targets yourself for the meme, otherwise specify a target after the command.",
    "<code>mb isbanned (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let toTarget = getTarget(user, context[0]);

    let uid = await getUserId(toTarget);
    let query = await findQuery('SELECT * FROM user_bans WHERE cid=? AND uid=? ORDER BY timestamp DESC LIMIT 1;', [userstate['room-id'], uid]);

    let isChannelBanned;
    let updatedRecently;
    let channelData;
    if (query[0]) {
      isChannelBanned = Boolean(query[0].unbanned);
      (isChannelBanned) ? updatedRecently = false : updatedRecently = true;
      channelData = true;
    } else {
      channelData = false;
    }

    try {
      let req = await axios.get(`https://api.ivr.fi/twitch/resolve/${toTarget}`);
      let data = req.data;

      if (channelData) {
        sendMessage(channel, `@${user} Twitch: ${data.banned.toString()} Channel: ${(isChannelBanned) ? 'false' : 'true'}, ${(updatedRecently) ? `banned ${calcDate(new Date(), new Date(query[0].updated), [])} ago.` : `unbanned ${calcDate(new Date(), new Date(query[0].timestamp), [])}`} ago.`);
      } else sendMessage(channel, `@${user} Twitch: ${data.banned.toString()} Channel: false`);

    } catch (error: any) {
      let why = error.response.data.error.toLowerCase();

      if (why === "user was not found") {
        return sendMessage(channel, `@${user} sorry I couldn't find the user ${toTarget}`);
      }
    }
  }
}

export = isbannedCommand;