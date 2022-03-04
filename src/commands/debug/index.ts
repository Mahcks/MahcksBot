import { Actions, CommonUserstate } from "tmi.js";
import { getUserId } from "../../utils/helix";
import { findQuery, insertRow, removeOne } from "../../utils/maria";
import { addChannelSetting, ChannelSettings, removeChannelSetting } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const debugCommand: CommandInt = {
  Name: "debug",
  Aliases: [],
  Permissions: ["developer"],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Debug command for developer use.",
  DynamicDescription: [
    "<code>!debug</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    let cmd = context[0]

    // Force bot to join a channel.
    if (cmd === "join") {
      let id = await getUserId(context[1]);
      if (!context[1]) return client.action(channel, `@${userstate['username']} please specify a channel to join.`);
      let isThere = await findQuery('SELECT * FROM channels WHERE id=?', [id]);
      if (isThere[0]) return client.action(channel, `@${userstate['username']} I'm already in ${context[1]}.`);

      // Insert into database
      await insertRow('INSERT INTO channels (id, username, prefix, role) VALUES (?, ?, ?, ?);', [id, context[1].toLowerCase(), '!', 'viewer']);

      // Add to cache
      if (id) {
        let settings: ChannelSettings = {
          id: id,
          prefix: "!",
          role: "viewer",
          username: context[1].toLowerCase()
        };

        addChannelSetting(settings);
      }

      let channelToJoin = context[1].toLowerCase();

      client.join(channelToJoin)
        .then((data) => {
          client.action(channelToJoin, 'Hello! MrDestructoid 👋');
        }).catch((err) => {
          client.action(channel, `@${channelToJoin} sorry there was an error trying to join your channel.`);
          console.log(err);
        });
    } else if (cmd === "leave") {
      let id = await getUserId(context[1]);
      // Force bot to leave a channel
      // Remove from database
      await removeOne('channels', 'id=?', [id]);

      // Remove from cache
      let uid: number;
      if (id) {
        uid = parseInt(id);
        removeChannelSetting(uid);
      }

      client.action(channel, 'Goodbye MrDestructoid 👋');
      client.part(channel);
    }
  }
}

export = debugCommand;