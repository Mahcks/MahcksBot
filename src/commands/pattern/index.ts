/* 
  make a pattern like the examples below but it be randomly generated

  ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀⠀⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ WhatChamp ⠀ ❓ ⠀ ⠀⠀ ⠀ ❓ ⠀⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀ ❓ ⠀ ⠀ ⠀⠀⠀ ⠀ ❓ ⠀ ⠀ ⠀ ⠀ ❓ 
  ★⠀⠀ AlienPls *⠀ ｡⠀ ⠀ﾟ⠀｡ ⠀ AlienPls ⠀ ⠀★⠀⠀⠀⠀⠀ ⠀ ⠀ ⠀ ⠀ ★⠀ ｡･⠀ AlienPls ⠀⠀ﾟ⠀⠀｡⠀ ⠀⠀☆⠀⠀ ⠀ ★⠀ ⠀ ･･⠀⠀ AlienPls ⠀ ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ AlienPls ⠀⠀★ ⠀ ⠀ *⠀ﾟ⠀ ⠀ ★⠀ ｡･⠀ AlienPls ∴⠀⠀ ⠀ ﾟ⠀ ⠀ ⠀ *⠀ﾟ⠀⠀⠀★⠀⠀⠀ ｡･ AlienPls ☆⠀⠀ 
*/

import { Actions, CommonUserstate } from "tmi.js";
import { CommandInt } from "../../validation/ComandSchema";

const patternCommand: CommandInt = {
  Name: "span",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Generate a pattern",
  DynamicDescription: [
    "<code>!pattern (emote)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: CommonUserstate, context: any[]) => {
    let template = '⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote) ⠀⠀⠀⠀ ⠀ ⠀ (emote)';
    template = template.replace(/(\(emote\))/gm, context[0]);

    return client.action(channel, template);
  }
}

export = patternCommand;