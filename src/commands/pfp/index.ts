import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { fetchAPI, getTarget, shortenURL } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const pfpCommand: CommandInt = {
  Name: "pfp",
  Aliases: ["avatar"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get a specific users profile picture, by default targets yourself.",
  DynamicDescription: [
    "Defaults to yourself, otherwise specify a user.",
    "<code>mb pfp (user)</code>",
    "<code>mb avatar (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let target = getTarget(user, context[0]);

    try {
      let res = await fetchAPI(`https://decapi.me/twitch/avatar/${target}`);
      if (res.toLowerCase().includes("user not found")) {
        sendMessage(channel, `@${user} couldn't find the user "${target}"`);
      } else {
        let link = await shortenURL(res);
        if (target.toLowerCase() === userstate["username"]) {
          sendMessage(channel, `@${user} here is your profile picture: ${link}`);
        } else sendMessage(channel, `@${user} here is their profile picture: ${link}`);
      }
    } catch (err) {
      //logError(user!, 'api', `Error fetching API for !pfp - https://decapi.me/twitch/avatar/${target}`, new Date());
      sendMessage(channel, `@${user} FeelsDankMan sorry, there was an API issue please try again later.`);
    }
  }
}

export = pfpCommand;