import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const ispartnerCommand: CommandInt = {
  Name: "ispartner",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check if a user is a partner on Twitch.",
  DynamicDescription: [
    "<code>!ispartner</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let tar = context[0];
    if (tar) {
      try {
        let request = await axios.get(`https://api.ivr.fi/twitch/resolve/${context[0]}`);
        let data = await request.data;

        let msg = (data.isPartner) ? `${tar} is a Twitch partner` : `${tar} is not a Twitch partner.`;
        sendMessage(client, channel, `@${user} ${msg}`);
      } catch (error) {
        return sendMessage(client, channel, `@${user} sorry I couldn't find that user FeelsDankMan`);
      }
    } else return sendMessage(client, channel, `@${user} please provide a streamer FeelsDankMan`);
  }
}

export = ispartnerCommand;