import { Actions, CommonUserstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { checkIfUserOptedout } from "../../utils";
import { getUserId } from "../../utils/helix";
import { findQuery, insertRow, removeOne, updateOne } from "../../utils/maria";
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
      if (!context[1]) return sendMessage(client, false, channel, `@${userstate['username']} please specify a channel to join.`);
      let isThere = await findQuery('SELECT * FROM channels WHERE id=?', [id]);
      if (isThere[0]) return sendMessage(client, false, channel, `@${userstate['username']} I'm already in ${context[1]}.`);

      // Insert into database
      await insertRow('INSERT INTO channels (id, username, prefix, role, disabledCommands, logged) VALUES (?, ?, ?, ?, ?, ?);', [id, context[1].toLowerCase(), '!', 'viewer', '[]', 0]);

      // Add to cache
      if (id) {
        let settings: ChannelSettings = {
          id: id,
          prefix: "!",
          role: 'viewer',
          username: context[1].toLowerCase(),
          disabledCommands: [],
          logged: false
        };

        addChannelSetting(settings);
      }

      let channelToJoin = context[1].toLowerCase();

      client.join(channelToJoin)
        .then((data) => {
          sendMessage(client, false, channelToJoin, 'Hello! MrDestructoid 👋');
        }).catch((err) => {
          sendMessage(client, false, channel, `@${channelToJoin} sorry there was an error trying to join your channel.`);
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

      sendMessage(client, false, channel, 'Goodbye MrDestructoid 👋');
      client.part(channel);
    
    } else if (cmd === "disable") {
      await updateOne('UPDATE channels SET disabledCommands=? WHERE username=?', [JSON.stringify(["ping"]), userstate['username']]);
      console.log('test');
    
    } else if (cmd === "isoptedout") {
      let isOptedOut = await checkIfUserOptedout(parseInt(userstate['user-id']!), context[1]);
      console.log(isOptedOut);
    }
  }
}

export = debugCommand;