import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getThumbnail } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";

const thumbnailCommand: CommandInt = {
  Name: "thumbnail",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get a thumbnail of a stream.",
  DynamicDescription: [
    'Targets the current channel if no channel is specified.',
    "<code>mb thumbnail (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    let target = (context[0]) ? context[0] : (channel.startsWith("#") ? channel = channel.substring(1) : channel);
    let thumbnail = await getThumbnail(target);
    sendMessage(channel, `@${user} thumbnail of the stream: ${thumbnail}`);    
  }
}

export = thumbnailCommand;