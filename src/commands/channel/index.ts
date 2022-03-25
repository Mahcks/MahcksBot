import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { ChannelSettings, getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const channelCommand: CommandInt = {
  Name: "channel",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Displays current settings for the channel.",
  DynamicDescription: [
    "<code>mb channel</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let currentSettings: ChannelSettings = await getChannelSettings(channel);
 
    let disabled = (currentSettings.disabledCommands.length === 0) ? "[None]" : (currentSettings.disabledCommands as string[]).join(", "); 
    sendMessage(channel, `@${user} current prefix: ${currentSettings.prefix} disabled commands: ${disabled}`);
  }
}

export = channelCommand;