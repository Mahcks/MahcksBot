import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTarget, humanizeNumber } from "../../utils";
import { getStreamInfo, getUserId } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";

const StreamInfoCommand: CommandInt = {
  Name: "streaminfo",
  Aliases: ["si"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get a streams information from any user.",
  DynamicDescription: [
    "By default it'll target the channel the bot is in.",
    "<code>mb streaminfo</code>",
    "",
    "You may also specific the streamer.",
    "<code>mb si</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const target = getTarget(userstate.username, context[0]);
    
    let id: number;
    if (target === userstate.username) {
      id = parseInt(userstate['user-id']!);
    } else {
      let getId = await getUserId(target);
      id = parseInt(getId);
    }

    let sd = await getStreamInfo(id);
    console.log(sd[0]);
    if (typeof sd[0] === "undefined") return sendMessage(channel, `@${userstate.username} that user is currently offline, try again later.`);
    sendMessage(channel, `@${userstate.username} ${sd[0].user_name} is streaming ${sd[0].game_name} to ${humanizeNumber(sd[0].viewer_count)} viewers. Current title: ${sd[0].title}`)
  }
}

export = StreamInfoCommand;