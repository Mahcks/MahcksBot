import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { updateOne } from "../../utils/maria";
import { updateChannelCache } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const exampleCommand: CommandInt = {
  Name: "prefix",
  Aliases: [],
  Permissions: ['broadcaster'],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Changes the prefix for the specific channel.",
  DynamicDescription: [
    "<code>mb prefix (new prefix)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    if (context[0]) {
      // make sure there isn't any spaces.
      if (/\s/g.test(context.join(" "))) {
        return sendMessage(channel, `@${user} you can't have spaces in your prefix.`);
      } else {
        await updateOne('UPDATE channels SET prefix=? WHERE id=?', [context[0], userstate['user-id']]);

        // Update cache
        await updateChannelCache(channel, 'prefix', context[0]);

        return sendMessage(channel, `@${user} set the prefix to "${context[0]}"`);
      }
    } else return sendMessage(channel, `@${user} please provide a new prefix.`);
  }
}

export = exampleCommand;