import { Actions, CommonUserstate } from "tmi.js";
import { redis } from "../../main";
import sendMessage from "../../modules/send-message/sendMessage";
import { checkIfUserOptedout, getBestAvilableEmote, isMod } from "../../utils";
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
      if (!context[1]) return sendMessage(client, channel, `@${userstate['username']} please specify a channel to join.`);
      let isThere = await findQuery('SELECT * FROM channels WHERE id=?', [id]);
      if (isThere[0]) return sendMessage(client, channel, `@${userstate['username']} I'm already in ${context[1]}.`);

      // Insert into database
      await insertRow('INSERT INTO channels (id, username, prefix, role, disabledCommands, logged, sevenTvUpdates) VALUES (?, ?, ?, ?, ?, ?, ?);', [id, context[1].toLowerCase(), 'mb', 'viewer', '[]', 0, 1]);

      // Add to cache
      if (id) {
        let settings: ChannelSettings = {
          id: id,
          prefix: "mb",
          role: 'viewer',
          username: context[1].toLowerCase(),
          disabledCommands: [],
          logged: true,
          sevenTvUpdates: true
        };

        addChannelSetting(settings);
      }

      let channelToJoin = context[1].toLowerCase();

      client.join(channelToJoin)
        .then((data) => {
          sendMessage(client, channelToJoin, 'Hello! MrDestructoid 👋 my prefix is "mb". My commands are here: https://www.mahcks.com/mb/commands');
        }).catch((err) => {
          sendMessage(client, channel, `@${channelToJoin} sorry there was an error trying to join your channel.`);
          console.log(err);
        });
    } else if (cmd === "leave") {
      let id = await getUserId(context[1]);
      // Force bot to leave a channel
      // Remove from database
      await removeOne('channels', 'id=?', [id]);

      // Remove from cache
      if (id) {
        removeChannelSetting(channel);
      }

      sendMessage(client, channel, 'Goodbye MrDestructoid 👋');
      client.part(channel);

    } else if (cmd === "disable") {
      await updateOne('UPDATE channels SET disabledCommands=? WHERE username=?', [JSON.stringify(["ping"]), userstate['username']]);
      console.log('test');

    } else if (cmd === "isoptedout") {
      let isOptedOut = await checkIfUserOptedout(parseInt(userstate['user-id']!), context[1]);
      console.log(isOptedOut);

    } else if (cmd === "ismod") {
      let testMod = await isMod(userstate, channel);
      console.log(testMod);

    } else if (cmd === "bestemote") {
      let found = await getBestAvilableEmote(channel, ["AlienUnpleased", "ApuCool"], ["TriHard"]);
      console.log(found);
    
    } else if (cmd === "redis") {
      redis.set("foo", "bar");

      redis.get("foo", (err: any, result: any) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      });
    }
  }
}

export = debugCommand;