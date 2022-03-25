import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { calcDate } from "../../utils";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/ComandSchema";

const lastbanCommand: CommandInt = {
  Name: "lastban",
  Aliases: ["lban", "latestban"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Gets the latest ban from the channel.",
  DynamicDescription: [
    "<code>mb lastban</code>",
    "<code>mb lban</code>",
    "<code>mb latestban</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let query = await findQuery('SELECT * FROM user_bans WHERE cid=? ORDER BY timestamp DESC LIMIT 1;', [userstate["room-id"]]);
    if (!query[0]) return sendMessage(channel, `${user} no bans have been tracked here.`);

    let msg = (Boolean(query[0].unbanned))
    ? `@${user} the latest permanent ban in this channel was ${query[0].username} ${calcDate(new Date(), new Date(query[0].timestamp), [])} ago and they were unbanned ${calcDate(new Date(), new Date(query[0].updated), [])} ago.`
    : `@${user} the latest permanent ban in this channel was ${query[0].username} ${calcDate(new Date(), new Date(query[0].timestamp), [])} ago.`;
    sendMessage(channel, msg);
  }
}

export = lastbanCommand;