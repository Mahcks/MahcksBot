import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { fetchAPI, humanizeNumber } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const UrbanDictionaryCommand: CommandInt = {
  Name: "urbandictionary",
  Aliases: ["ud"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Searches for word definitions from Urban Dictionary and grabs the one with most upvotes.",
  DynamicDescription: [
    "<code>mb urbandictionary</code>",
    "<code>mb ud</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const link = (/(-random)/g.test(context[0])) ? "https://api.urbandictionary.com/v0/random" : `http://api.urbandictionary.com/v0/define?term=${context.join(' ')}`;

    const req = await fetchAPI(link);
    if (req.error) return sendMessage(channel, `@${user} ${req.defaultMessage}`);
    if (req.data.data.list.length === 0) return sendMessage(channel, `@${user} couldn't find any results for that search.`);
    const max: any = req.data.data.list.reduce((prev: any, curr: any) => (prev.thumbs_up > curr.thumbs_up) ? prev : curr);
    let msg = `@${user} [${humanizeNumber(max.thumbs_up)} 👍 | ${humanizeNumber(max.thumbs_down)} 👎] ${max.definition.replace(/[\[\]']+/g, '')}`;

    if (msg.length >= 500) {
      msg = msg.slice(0, -(msg.length - 550));
      msg = msg.slice(0, -(max.permalink.length + "... - ".length + 10));
      msg = msg + `... - ${max.permalink}`;
      return sendMessage(channel, msg);
    } else {
      msg = msg + ` - ${max.permalink}`;
      return sendMessage(channel, msg);
    }
  }
}

export = UrbanDictionaryCommand;