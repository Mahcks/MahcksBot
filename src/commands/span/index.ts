/* 
  make a pattern like the examples below but it be randomly generated

  ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀⠀⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ WhatChamp ⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ❓ 
  ★⠀⠀ (emote) *⠀ ｡⠀ ⠀ﾟ⠀｡ ⠀ (emote) ⠀ ⠀★⠀⠀⠀⠀⠀ ⠀ ⠀ ⠀ ⠀ ★⠀ ｡･⠀ (emote) ⠀⠀ﾟ⠀⠀｡⠀ ⠀⠀☆⠀⠀ ⠀ ★⠀ ⠀ ･･⠀⠀ (emote) ⠀ ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ (emote) ⠀⠀★ ⠀ ⠀ *⠀ﾟ⠀ ⠀ ★⠀ ｡･⠀ (emote) ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ (emote) ☆⠀⠀ 
*/

import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { isMod, removeFirstWord } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const patternCommand: CommandInt = {
  Name: "span",
  Aliases: ['spam'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Generates a pattern with a specific emote.",
  DynamicDescription: [
    "<code>!span (pattern: normal, space, what) (emote(s))</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let input = context[0];
    
    let ein = context.join(" ");
    console.log("emote input", ein);

    let normal = '⠀⠀⠀⠀ ⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀  (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote)';
    let space = '★⠀ ｡･⠀ (emote) ⠀⠀ﾟ⠀⠀｡⠀ (emote) ☆ ⠀ ･･⠀⠀ (emote) ★⠀ ⠀ *⠀ﾟ⠀⠀☆⠀⠀ ｡･ (emote) ⠀⠀★ ⠀ ⠀ *⠀ﾟ⠀ ⠀ ★⠀ ｡･⠀ (emote) ∴⠀ ﾟ * ⠀ﾟ⠀ (emote) ⠀⠀ﾟ⠀⠀｡⠀⠀☆⠀⠀⠀ ｡･ (emote) ★ ⠀*⠀ﾟ⠀⠀ ｡･ (emote) ⠀★ ';
    let what = '❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀⠀⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀⠀ ❓ ⠀ ⠀⠀ ⠀ (emote) ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ❓';

    let chosen;
    if (!input) chosen = normal;
    if (input === "space") {
      return sendMessage(channel, space.replace(/(\(emote\))/gm, removeFirstWord(ein)));
    } else if (input === "what") {
      return sendMessage(channel, what.replace(/(\(emote\))/gm, removeFirstWord(ein)));
    } else if (input === "pyramid") {
      let amMod = await isMod(userstate, channel.substring(1));
      if (amMod) {
        const createPyramid = (height: number) => {
          for (var i = 1; i <= height; i++) {
            var row = '';
    
            for (var j = 1; j <= i; j++)
              row += " " + ein;
            sendMessage(channel, row);
          }
          for (var i = height - 1; i > 0; i--) {
            var row = '';
    
            for (var j = i; j > 0; j--)
              row += " " + ein;
            sendMessage(channel, row);
          }
        }
        createPyramid(3);
      } else return sendMessage(channel, `@${user} this is best used when I'm a mod or VIP.`);

    } else if (input === "triangle") {
      let amMod = await isMod(userstate, channel.substring(1));
      if (amMod) {
        const createTriangle = (height: number) => {
          for (var i = 1; i <= height; i++) {
            sendMessage(channel, removeFirstWord((' ' + ein + ' ').repeat(i)))
          }
        }
  
        createTriangle(3);
     } else return sendMessage(channel, `@${user} this is best used when I'm a mod or VIP`);
    } else chosen = sendMessage(channel, normal.replace(/(\(emote\))/gm, ein));;
  }
}

export = patternCommand;