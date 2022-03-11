import { Actions, CommonUserstate, Userstate } from "tmi.js";
import { fetchAndStoreEmotes, storeAllEmotes } from "../../modules/emote-listener";
import { findQuery, insertRow, removeOne } from "../../utils/maria";
import { addChannelSetting, ChannelSettings, removeChannelSetting } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const leaveCommand: CommandInt = {
  Name: "join",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Join your channel.",
  DynamicDescription: [
    "<code>!join</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let isThere = await findQuery('SELECT * FROM channels WHERE id=?', [userstate['user-id']!]);
    if (isThere[0]) return client.action(channel, `@${userstate.username} I'm already in your channel.`);

    // Insert into database
    await insertRow('INSERT INTO channels (id, username, prefix, role, disabledCommands, logged) VALUES (?, ?, ?, ?, ?, ?);', 
    [parseInt(userstate['user-id']!), context[1].toLowerCase(), '!', 'viewer', '[]', 0]);

    // Add to cache
    let uid: number;
    if (userstate['user-id']) {
      uid = parseInt(userstate['user-id']);
      let settings: ChannelSettings = {
        id: uid,
        username: userstate["username"], 
        prefix: "mb",
        role: 'viewer',
        disabledCommands: [],
        logged: false
      };

      addChannelSetting(settings);
    } 

    let channelToJoin = `${userstate.username}`

    client.join(channelToJoin)
    .then(async (data) => {
      client.action(channelToJoin, 'Hello! MrDestructoid 👋');
      await storeAllEmotes(channel.substring(1), parseInt(userstate["user-id"]!));
    }).catch((err) => {
      client.action(channel, `@${channelToJoin} sorry there was an error trying to join your channel.`);
      console.log(err);
    });
  }
}

export = leaveCommand;