import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { cacheEmoteOrigins, checkEmoteOrigin, fetchAPI, findEmoteByPrio, humanizeNumber } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";
import * as fs from 'fs';
import * as path from 'path';

const WhatEmoteIsItCommand: CommandInt = {
  Name: "whatemoteisit",
  Aliases: ["weit"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "What emote is it? Give a specific emote and it will give information about it.",
  DynamicDescription: [
    "Powered by api.ivr.fi and supinic.com",
    "<code>mb whatemoteisit forsenE</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const input = context[0];

    if (input.toLowerCase() === "7tv") {
      const sevenTVSearch = await findEmoteByPrio(context[1], "7tv");
      const stvEmote = sevenTVSearch.data.search_emotes[0];
      let stvOrigin = await checkEmoteOrigin(stvEmote.id);
      let originString = (stvOrigin == null) ? "" : "check its origin using the origin command";
      return sendMessage(channel, `${stvEmote.name} - ID ${stvEmote.id} - channel count: ${humanizeNumber(stvEmote.channel_count)}. https://7tv.app/emotes/${stvEmote.id} ${originString}`);
    } else if (input.toLowerCase() === "bttv") {
      const bttvSearch = await findEmoteByPrio(context[1], "bttv");
      console.log(bttvSearch);
    }

    /* Checks for third party globals */
    let tpgData = fs.readFileSync(path.join(__dirname, "./globals.json"), 'utf-8');
    const tpg = JSON.parse(tpgData);
    const bttvSearch = tpg.bttv.find((entry: any) => entry.code === input) ?? null;
    const ffzSearch = tpg.ffz.find((entry: any) => entry.code === input) ?? null;
    const sTVSearch = tpg.sevenTV.find((entry: any) => entry.code === input) ?? null;

    if (bttvSearch !== null) { 
      let bttvOrigin = await checkEmoteOrigin(bttvSearch.id);
      let originString = (bttvOrigin == null) ? "" : "check its origin using the origin command";
      return sendMessage(channel, `@${user} ${bttvSearch.code} - ID ${bttvSearch.id} - global BTTV emote. https://e.wrnv.xyz/${bttvSearch.code} ${originString}`);
    }
    
    if (ffzSearch !== null) { 
      let ffzOrigin = await checkEmoteOrigin(parseInt(ffzSearch.id));
      let originString = (ffzOrigin == null) ? "" : "check its origin using the origin command";
      return sendMessage(channel, `@${user} ${ffzSearch.code} is a FFZ global emote. https://e.wrnv.xyz/${ffzSearch.code} ${originString}`);
    }

    if (sTVSearch !== null) {
      let sTVOrigin = await checkEmoteOrigin(parseInt(sTVSearch.id));
      let originString = (sTVOrigin == null) ? "" : "check its origin using the origin command";
      return sendMessage(channel, `@${user} ${sTVSearch.code} is a 7tv global emote. https://e.wrnv.xyz/${sTVSearch.code} ${originString}`);
    }

    // TODO: Add check for 7tv global

    const twitchEmote = await fetchAPI(`https://api.ivr.fi/v2/twitch/emotes/${input}`);
    if (twitchEmote.error && twitchEmote.data.statusCode === 404 && bttvSearch == null && ffzSearch == null) {
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
    const active = (tEmote.emoteState === "INACTIVE") ? "inactive" : "";
    const cdnLink = `https://static-cdn.jtvnw.net/emoticons/v2/${tEmote.emoteID}/default/dark/3.0`
    const emoteOrigin = await checkEmoteOrigin(parseInt(tEmote.emoteID!));
    console.log("origin", emoteOrigin);

    let tier = "";
    if (tEmote.emoteType === "SUBSCRIPTIONS") {
      if (!tEmote.channelName && !tEmote.channelLogin) {
        const tier = (tEmote.emoteTier) ? `Tier ${tEmote.emoteTier}` : "";
        return sendMessage(channel, `@${user} ${tEmote.emoteCode} (ID: ${tEmote.emoteCode}) - ${active} ${tier} emote to an unknown banned or deleted channel. ${cdnLink}`);
      } else if (tEmote.channelName !== null) {
        let channelString = `@${tEmote.channelName}`;
        if (tEmote.channelName.toLowerCase() !== tEmote.channelLogin?.toLowerCase()) {
          channelString = `@${tEmote.channelLogin} (${tEmote.channelName})`;
        }

        tier = `Tier ${tEmote.emoteTier} ${tEmote.emoteAssetType?.toLowerCase()} sub emote to channel ${channelString}`;
      }
    } else if (tEmote.emoteType === "GLOBALS") {
      tier = "global Twitch emote";
    } else {
      tier = `${tEmote.emoteAssetType?.toLowerCase() ?? ""} ${tEmote.emoteType?.toLowerCase() ?? ""} ${tEmote.channelName ?? ""} emote`;
    }
    const emoteLink = `https://e.wrnv.xyz/${tEmote.emoteCode}`;
    sendMessage(channel, `${tEmote.emoteCode} - ID ${tEmote.emoteID} - ${active} ${tier}. ${emoteLink}`); 
  }
}

export = WhatEmoteIsItCommand;