// Show a random emote
/* 

~randome esfandtv - picks a random non-sub emote.
~randemo esfandtv shared 
*/

import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getUserId } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";

const randomeCommand: CommandInt = {
  Name: "randome",
  Aliases: ['randomemote'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Picks a random emote from a given channel. If no channel is provided it picks an emote from the current channel.",
  DynamicDescription: [
    "<code>mb randome (channel)</code>",
    "<code>mb randomemote (channel)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let platforms = ['7tv']; //'bttv' 'ffz'
    let platform = platforms[Math.floor(Math.random()*platforms.length)];
  
    let target = (context[0]) ? context[0] : channel.substring(1);

    let uid = await getUserId(target);
    if (!uid) return sendMessage(channel, `@${user} couldn't find the user "${target}"`);
    //let targetMsg = (context[0]) ? `random emote from ${context[0]}` : `random emote from this channel`;
    
    if (platform === "bttv") {
      let req = await axios.get('https://api.betterttv.net/3/cached/users/twitch/'+uid);
      let data = req.data;
      let combined = [...data.sharedEmotes, ...data.channelEmotes];

      let random = combined[Math.floor(Math.random()*combined.length)];
      sendMessage(channel, `@${user} BTTV ${random.code} https://betterttv.com/emotes/${random.id}`);
    
    } else if (platform === "ffz") {
      let req = await axios.get(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${uid}`);
      let data = req.data;

      let random = data[Math.floor(Math.random()*data.length)];
      sendMessage(channel, `@${user} FFZ ${random.code} https://www.frankerfacez.com/emoticon/${random.id}`);
    
    } else if (platform === '7tv') {
      let req = await axios.get(`https://api.7tv.app/v2/users/${target.toLowerCase()}/emotes`);
      let data = req.data;

      let random = data[Math.floor(Math.random()*data.length)];
      sendMessage(channel, `@${user} 7tv ${random.name} https://7tv.app/emotes/${random.id}`);
    }
  }
}

export = randomeCommand;