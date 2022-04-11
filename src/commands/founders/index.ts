import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { fetchAPI, postHastebin } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const FoundersCommand: CommandInt = {
  Name: "founders",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Checks the founders of a given channel.",
  DynamicDescription: [
    "<code>mb founders</code>",
    "<code>mb founders (channel)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const targetChannel = (context[0]) ? context[0].replace("@", "") : channel.replace("#", "");

    let req = await fetchAPI(`https://api.ivr.fi/v2/twitch/founders/${targetChannel}`);
    if (req.error) {
      if (req.data.statusCode == 404) {
        return sendMessage(channel, `@${user} sorry, there are no founders for that channel.`);
      } else return sendMessage(channel, `@${user} ${req.defaultMessage}`);
    }

    interface FounderFetch {
      isSubscribed: boolean;
      entitlementStart: string;
      id: string;
      login: string;
      displayName: string;
    }

    let founderData = req.data.founders.sort((a: any, b: any) => new Date(b.entitlementStart).getDate() - new Date(a.entitlementStart).getDate());
    let founders: string[] = [];
    founderData.forEach((user: FounderFetch) => {
      founders.push(`Username: ${user.displayName}\nStill subscribed? ${(user.isSubscribed) ? "Yes" : "No"}\nDate: ${new Date(user.entitlementStart)}`);
    });

    let haste = await postHastebin(founders.join("\n\n"));
    sendMessage(channel, `@${user} total of ${founders.length} in that channel. ${haste}`);
  }
}

export = FoundersCommand;