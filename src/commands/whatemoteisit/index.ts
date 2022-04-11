import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { fetchAPI } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const WhatEmoteIsItCommand: CommandInt = {
  Name: "whatemoteisit",
  Aliases: ["weit"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "What emote is it? Give a specific emote and it will give information about it.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const input = context[0];

    const twitchEmote = await fetchAPI(`https://api.ivr.fi/v2/twitch/emotes/${input}`);
    if (twitchEmote.error) return sendMessage(channel, `@${user} ${twitchEmote.data.message}`);

    let tEmote = twitchEmote.data;
    let emoteMessage = `@${user} the emote ${tEmote.emoteCode} belongs to the channel ${tEmote.channelName}. You have to be a ${(tEmote.emoteType === "SUBSCRIPTIONS") ? `Tier ${tEmote.emoteTier} subscriber` : "follower of the channel"} to unlock this emote https://e.wrnv.xyz/${tEmote.emoteCode}`;
    sendMessage(channel, emoteMessage)
  }
}

export = WhatEmoteIsItCommand;