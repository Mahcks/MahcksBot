/* 
  make a pattern like the examples below but it be randomly generated

  ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀⠀⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ WhatChamp ⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ❓ 
  ★⠀⠀ (emote) *⠀ ｡⠀ ⠀ﾟ⠀｡ ⠀ (emote) ⠀ ⠀★⠀⠀⠀⠀⠀ ⠀ ⠀ ⠀ ⠀ ★⠀ ｡･⠀ (emote) ⠀⠀ﾟ⠀⠀｡⠀ ⠀⠀☆⠀⠀ ⠀ ★⠀ ⠀ ･･⠀⠀ (emote) ⠀ ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ (emote) ⠀⠀★ ⠀ ⠀ *⠀ﾟ⠀ ⠀ ★⠀ ｡･⠀ (emote) ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ (emote) ☆⠀⠀ 
*/

import { Actions, CommonUserstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const patternCommand: CommandInt = {
  Name: "span",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Generates a pattern with a specific emote.",
  DynamicDescription: [
    "<code>!span (emote) (pattern: normal, space, what)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    let input = context[1];

    let normal = '⠀⠀⠀⠀ ⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀  (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote)';
    let space = '★⠀ ｡･⠀ (emote) ⠀⠀ﾟ⠀⠀｡⠀ (emote) ☆ ⠀ ･･⠀⠀ (emote) ★⠀ ⠀ *⠀ﾟ⠀⠀☆⠀⠀ ｡･ (emote) ⠀⠀★ ⠀ ⠀ *⠀ﾟ⠀ ⠀ ★⠀ ｡･⠀ (emote) ∴⠀ ﾟ * ⠀ﾟ⠀ (emote) ⠀⠀ﾟ⠀⠀｡⠀⠀☆⠀⠀⠀ ｡･ (emote) ★ ⠀*⠀ﾟ⠀⠀ ｡･ (emote) ⠀★ ';
    let what = '❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀⠀⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀⠀ ❓ ⠀ ⠀⠀ ⠀ (emote) ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ❓';

    let chosen;
    if (!input) chosen = normal;

    if (input === "space") {
      return sendMessage(client, false, channel, space.replace(/(\(emote\))/gm, context[0]));
    } else if (input === "what") {
      return sendMessage(client, false, channel, what.replace(/(\(emote\))/gm, context[0]));
    } else if (input === "pyramid") {
      const createPyramid = (height: number) => {
        for (var i = 1; i <= height; i++) {
          var row = '';
  
          for (var j = 1; j <= i; j++)
            row += " " + context[0];
          sendMessage(client, false, channel, row);
        }
        for (var i = height - 1; i > 0; i--) {
          var row = '';
  
          for (var j = i; j > 0; j--)
            row += " " + context[0];
          sendMessage(client, false, channel, row);
        }
      }

      createPyramid(5);

    } else chosen = sendMessage(client, false, channel, normal.replace(/(\(emote\))/gm, context[0]));;

    
  }
}

export = patternCommand;