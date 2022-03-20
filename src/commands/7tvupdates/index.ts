import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findQuery, sqlQuery } from "../../utils/maria";
import { getChannelSettings, updateChannelCache } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const seventvupdatesCommand: CommandInt = {
  Name: "7tvupdates",
  Aliases: ["7tvu"],
  Permissions: ["broadcaster"],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "7tv updates in chat for anyone who misses the notification from the extension or uses Chatterino.",
  DynamicDescription: [
    "<code>mb 7tvupdates</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    let currSettings = await getChannelSettings(channel);
    let isEnabled = currSettings.sevenTvUpdates;

    if (isEnabled) {
      sendMessage(channel, `@${user} disabled 7tv chat updates.`);
      await updateChannelCache(channel, "sevenTvUpdates", false);
      await sqlQuery('UPDATE channels SET sevenTvUpdates=? WHERE id=?', [0, userstate['room-id']]);
    } else {
      sendMessage(channel, `@${user} enabled 7tv chat updates.`);
      await updateChannelCache(channel, "sevenTvUpdates", true);
      await sqlQuery('UPDATE channels SET sevenTvUpdates=? WHERE id=?', [1, userstate['room-id']]);
    }
  }
}

export = seventvupdatesCommand;