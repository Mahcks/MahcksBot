import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { checkEmoteOrigin, fetchAPI } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const OriginCommand: CommandInt = {
  Name: "origin",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check the origin of a Twitch emote. Powered by supinic.com",
  DynamicDescription: [
    "<code>mb origin forsenE</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    const twitchEmote = await fetchAPI(`https://api.ivr.fi/v2/twitch/emotes/${context[0]}`);
    if (twitchEmote.error && twitchEmote.data.statusCode === 404) {
      return sendMessage(channel, `@${user} couldn't find that emote.`);
    }

    /* Twitch Emote (global/sub) */
    interface EmoteFetch {
      channelName: string | null;
      channelLogin: string | null;
      channelID: string | null;
      emoteID: string | null;
      emoteCode: string | null;
      emoteURL: string | null;
      emoteSetID: string | null;
      emoteAssetType: string | null;
      emoteState: string | null;
      emoteType: string | null;
      emoteTier: string | null;
    }

    let tEmote: EmoteFetch = twitchEmote.data;
    const eData = await checkEmoteOrigin(tEmote.emoteID!);
    if (eData == null) return sendMessage(channel, `@${user} there is no origin for that emote.`);
    sendMessage(channel, `@${user} ${tEmote.emoteCode} - ${eData.text} https://supinic.com/data/origin/detail/${eData.ID}`)
  }
}

export = OriginCommand;