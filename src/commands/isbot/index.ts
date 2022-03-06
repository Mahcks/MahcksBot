import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const isbotCommand: CommandInt = {
  Name: "isbot",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check if a specific account is a verified Twitch bot.",
  DynamicDescription: [
    "<code>!isbot (name)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate["display-name"];
    if (context[0]) {
      try {
        let request = await axios.get(`https://api.ivr.fi/twitch/resolve/${context[0]}`);
        let data = await request.data;

        let msg = (data.bot) ? `@${user} the account ${data.displayName} is a verified Twitch bot.` : `@${user} the account ${data.displayName} is not a verified Twitch bot.`;
        return sendMessage(client, channel, msg);
      } catch (error) {
        return sendMessage(client, channel, `@${user} sorry I couldn't find the user "${context[0]}"`);
      }
    } else return sendMessage(client, channel, `@${user} please specific a user to check.`);
  }
}

export = isbotCommand;