import axios from "axios";
import { Actions, CommonUserstate, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const isbannedCommand: CommandInt = {
  Name: "isbanned",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check if a user is banned.",
  DynamicDescription: [
    "By default it targets yourself for the meme, otherwise specify a target after the command.",
    "<code>!isbanned (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let toTarget = getTarget(user, context[0]);

    try {
      let req = await axios.get(`https://api.ivr.fi/twitch/resolve/${toTarget}`);

      let data = req.data;

      let isBanned = data.banned;
      let toSend = (isBanned) ? 'banned PoroSad' : 'not banned from Twitch PogChamp';

      sendMessage(client, channel, `@${user} "${toTarget}" is ${toSend}`);

    } catch (error: any) {
      let why = error.response.data.error.toLowerCase();

      if (why === "user was not found") {
        return sendMessage(client, channel, `@${user} sorry I couldn't find the user ${toTarget}`);
      }
    }
  }
}

export = isbannedCommand;