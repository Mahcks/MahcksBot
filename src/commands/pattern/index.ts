/* 
  make a pattern like the examples below but it be randomly generated

  ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀⠀⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ WhatChamp ⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ❓ 
  ★⠀⠀ AlienPls *⠀ ｡⠀ ⠀ﾟ⠀｡ ⠀ AlienPls ⠀ ⠀★⠀⠀⠀⠀⠀ ⠀ ⠀ ⠀ ⠀ ★⠀ ｡･⠀ AlienPls ⠀⠀ﾟ⠀⠀｡⠀ ⠀⠀☆⠀⠀ ⠀ ★⠀ ⠀ ･･⠀⠀ AlienPls ⠀ ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ AlienPls ⠀⠀★ ⠀ ⠀ *⠀ﾟ⠀ ⠀ ★⠀ ｡･⠀ AlienPls ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ AlienPls ☆⠀⠀ 
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
    "<code>!pattern (emote)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    let template = '⠀⠀⠀⠀ ⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀  (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote)';
    template = template.replace(/(\(emote\))/gm, context[0]);

    return sendMessage(client, false, channel, template);
  }
}

export = patternCommand;