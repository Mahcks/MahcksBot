import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { calcDate, humanizeNumber } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const dislikesCommand: CommandInt = {
  Name: "dislikes",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Show votes on a specific YouTube video by ID.",
  DynamicDescription: [
    "<code>!dislikes (videoId)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    if (!context[0]) return sendMessage(client, channel, `@${user} please specify the YouTube video ID to get the stats.`);

    // Thanks to 0Supa https://github.com/0Supa/okeybot/blob/main/lib/commands/dislikes.js
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = context[0].match(regExp);

    let videoId;
    if (match && match[7].length === 11) {
      videoId = match[7];
    } else videoId = context[0];

    try {
      let req = await axios.get(`https://returnyoutubedislikeapi.com/votes?videoId=${encodeURIComponent(videoId)}`);
      console.log(req.data);
      sendMessage(client, channel, `@${user} 👍 Likes: ${humanizeNumber(req.data.likes)} 👎 Dislikes: ${humanizeNumber(req.data.dislikes)} 👁 Views: ${humanizeNumber(req.data.viewCount)} Stats created: ${calcDate(new Date(), new Date(req.data.dateCreated), [])}`);
    } catch (error) {
      sendMessage(client, channel, `@${user} an unexpected error occurred. Make sure it was a valid YouTube video ID.`);
    }
  }
}

export = dislikesCommand;