import axios from "axios";
import { Actions, CommonUserstate } from "tmi.js";
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
    "<code>!isbanned (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    const user = userstate["display-name"];
    let toTarget = getTarget(user, context[0]);

    try {
      let req = await axios.get(`https://api.ivr.fi/twitch/resolve/${toTarget}`);

      let data = req.data;

      if (toTarget.toLowerCase() !== userstate["username"]) {
        return client.action(channel, `@${user} "${toTarget}" is banned from Twitch`);
      } else return client.action(channel, `@${user} you're not banned PogChamp`)

    } catch (error: any) {
      let why = error.response.data.error.toLowerCase();

      if (why === "user was not found") {
        return client.action(channel, `@${user} sorry I couldn't find the user ${toTarget}`);
      }
    }
  }
}

export = isbannedCommand;