import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { randomArray, shortenURL } from "../../utils";
import reddit from "../../utils/reddit";
import { CommandInt } from "../../validation/ComandSchema";

const CarsCommand: CommandInt = {
  Name: "cars",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Grabs a car post from a random subreddit",
  DynamicDescription: [
    "<code>mb cars</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    const post = await reddit.getRandomPost("cars", randomArray(reddit.carSubreddits));
    if (typeof post === "string") return sendMessage(channel, `@${user} ${post}`);
    const url = await shortenURL("https://www.reddit.com"+post.permalink);
    sendMessage(channel, `@${user} ${post.title} ${post.url_overridden_by_dest} | ${url}`);
  }
}

export = CarsCommand;