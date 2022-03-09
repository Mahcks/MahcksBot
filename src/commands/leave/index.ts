import { Actions, CommonUserstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { removeOne } from "../../utils/maria";
import { removeChannelSetting } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const leaveCommand: CommandInt = {
  Name: "leave",
  Aliases: ["part"],
  Permissions: ['broadcaster'],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Leaves the channel it's in.",
  DynamicDescription: [
    "<code>!leave</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {

    // Remove from database
    await removeOne('channels', 'id=?', [userstate["user-id"]]);

    // Remove from cache
    if (userstate['user-id']) {
      removeChannelSetting(channel);
    } 

    sendMessage(client, channel, 'Goodbye MrDestructoid 👋');
    client.part(channel);
  }
}

export = leaveCommand;