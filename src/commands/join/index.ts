import { Actions, CommonUserstate } from "tmi.js";
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
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    let isThere = await findQuery('SELECT * FROM channels WHERE id=?', [userstate['user-id']!]);
    if (isThere[0]) return client.action(channel, `@${userstate['username']} I'm already in your channel.`);

    // Insert into database
    await insertRow('INSERT INTO channels (id, username, prefix, disabledCommands, logged) VALUES (?, ?, ?, ?, ?);', 
    [parseInt(userstate["user-id"]!), userstate['username'], '!', JSON.stringify([]), 0]);

    // Add to cache
    let uid: number;
    if (userstate['user-id']) {
      uid = parseInt(userstate['user-id']);
      let settings: ChannelSettings = {
        id: uid,
        prefix: "!",
        username: userstate["username"], 
        disabledCommands: [],
        logged: false
      };

      addChannelSetting(settings);
    } 

    let channelToJoin = `${userstate['username']}`

    client.join(channelToJoin)
    .then((data) => {
      client.action(channelToJoin, 'Hello! MrDestructoid 👋');
    }).catch((err) => {
      client.action(channel, `@${channelToJoin} sorry there was an error trying to join your channel.`);
      console.log(err);
    });
  }
}

export = leaveCommand;