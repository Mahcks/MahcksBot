import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { pickNumberBetweenRange } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const wouldyouratherCommand: CommandInt = {
  Name: "wouldyourather",
  Aliases: ['wyr', 'wur'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Generates a would you rather question.",
  DynamicDescription: [
    "<code>mb wouldyourather</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    try {
      let res = await axios.get('https://api.aakhilv.me/fun/wyr?num=1');
      sendMessage(client, channel, `@${user} ${res.data[0]}`);

    } catch (err) {
      sendMessage(client, channel, `@${user} there was an error fetching a question. Please try again later FeelsDankMan`);
    }
  }
}

export = wouldyouratherCommand;