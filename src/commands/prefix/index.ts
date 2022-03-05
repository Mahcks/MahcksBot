import { Actions, Userstate } from "tmi.js";
import { updateOne } from "../../utils/maria";
import { updatePrefix } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const exampleCommand: CommandInt = {
  Name: "prefix",
  Aliases: [],
  Permissions: ['broadcaster'],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Changes the prefix for the specific channel.",
  DynamicDescription: [
    "<code>!prefix (new prefix)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate['username'];

    if (context[0]) {
      // make sure there isn't any spaces.
      if (/\s/g.test(context.join(" "))) {
        return client.action(channel, `@${user} you can't have spaces in your prefix.`);
      } else {
        await updateOne('UPDATE channels SET prefix=? WHERE id=?', [context[0], userstate['user-id']]);

        // Update cache
        await updatePrefix(parseInt(userstate['user-id']!), 'prefix', context[0]);

        return client.action(channel, `@${user} set the prefix to "${context[0]}"`);
      }
    } else return client.action(channel, `@${user} please provide a new prefix.`);
  }
}

export = exampleCommand;