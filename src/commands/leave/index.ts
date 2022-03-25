import { Actions, CommonUserstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { findOne, findQuery, removeOne } from "../../utils/maria";
import { removeChannelSetting } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const leaveCommand: CommandInt = {
  Name: "leave",
  Aliases: ["part"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Bot leaves the user's channel. It must be used in the bot's channel only.",
  DynamicDescription: [
    "<code>mb leave</code>",
    "<code>mb part</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    const user = userstate.username;
    if (channel === "#mahcksimus") {
      let query = await findQuery('SELECT id FROM channels WHERE id=?', [userstate["user-id"]]);
      if (query[0]) {
        // Remove from database
        await removeOne('channels', 'id=?', [userstate["user-id"]]);
  
        // Remove from cache
        if (userstate['user-id']) {
          removeChannelSetting(channel);
        }
  
        sendMessage(channel, `Goodbye ${user} MrDestructoid 👋`);
        client.part(channel); 
      } else sendMessage(channel, `@${user} this bot isn't in your channel. If you'd like to add it please use 'mb join'`);


    } else sendMessage(channel, `@${user} please use this command in the bot's channel.`);
  }
}

export = leaveCommand;