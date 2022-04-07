import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const AdviceCommand: CommandInt = {
  Name: "advice",
  Aliases: ["randomadvice", "radvice"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get some random advice that may or may not help in anyway.",
  DynamicDescription: [
    "<code>mb advice</code>",
    "<code>mb randomadvice</code>",
    "<code>mb radvice</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    try {
      const response = await axios.get("https://api.adviceslip.com/advice");
      let body = response.data;
      sendMessage(channel, `@${userstate['display-name']} ${body["slip"]["advice"]}`);
    } catch (error) {
      return sendMessage(channel, `@${userstate.username} FeelsDankMan sorry, there was an API issue. Please try again later.`);
    }
  }
}

export = AdviceCommand;