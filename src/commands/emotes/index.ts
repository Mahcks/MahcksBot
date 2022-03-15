import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getUserId } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";
import { findQuery, sqlQuery } from "../../utils/maria";
import { calcDate } from "../../utils";

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

    if (target === "latest") {
      let query = await sqlQuery('SELECT * FROM emotes WHERE channel=? ORDER BY date DESC LIMIT 5;', [channel.substring(1)]);

      let emoteStr = '';
      query.forEach((emote: any) => {
        emoteStr += `${emote.name} (${calcDate(new Date(), new Date(emote.date), [])} ago) `;
      });

      sendMessage(client, channel, `@${user} 5 latest emotes: ${emoteStr}`);
      return;
    }

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