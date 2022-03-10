import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getUserId } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";
import { findQuery } from "../../utils/maria";

const emotesCommand: CommandInt = {
  Name: "emotes",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Links all emotes in the current channel.",
  DynamicDescription: [
    "By default it targets the current channel, otherwise you can input a seperate channel.",
    "<code>!emotes (channel)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let target = (context[0]) ? context[0] : channel;
    (target.startsWith("#")) ? target = target.substring(1) : target;

    let isUser = await getUserId(target);

    if (isUser) {
      let emoteCount = await findQuery('SELECT COUNT(*) FROM emotes WHERE channel=? AND scope!="global";', [target.toLowerCase()]);
      if (target.toLowerCase() === channel.substring(1)) {
        sendMessage(client, channel, `@${user} this channel has ${emoteCount[0]["COUNT(*)"]} emotes: https://e.wrnv.xyz/list/${target}`);
      } else sendMessage(client, channel, `@${user} ${target} has ${emoteCount[0]["COUNT(*)"]} emotes: https://e.wrnv.xyz/list/${target}`);
    } else return sendMessage(client, channel, `@${user} that channel doesn't exist.`);
  }
}

export = emotesCommand;