import { Actions, Userstate } from "tmi.js";
import { applyFont } from "../../utils";
import { bold, fancy, fancyBold, outline, small } from "../../utils/fonts";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const fontCommand: CommandInt = {
  Name: "font",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Change the font of any text.",
  DynamicDescription: [
    "Change the font of a message.",
    "<code>!font (fancy, fancybold, outline, small) (message)</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let askedFont = context[0];
    let currentSettings = await getChannelSettings(channel.substring(1));

    function getTranslated() {
      context.shift();
      let message = context.join(" ").toLowerCase();
      return message;
    }

    if (askedFont === "fancy") {
      client.say(channel, `${applyFont(getTranslated(), fancy)}`);

    } else if (askedFont === "bold") {
      client.say(channel, `${applyFont(getTranslated(), bold)}`)

    } else if (askedFont === "fancybold") {
      client.say(channel, `${applyFont(getTranslated(), fancyBold)}`);

    } else if (askedFont === "outline") {
      client.say(channel, `${applyFont(getTranslated(), outline)}`);

    } else if (askedFont === "small") {
      client.say(channel, `${applyFont(getTranslated(), small)}`)
    } else client.say(channel, `@${userstate["display-name"]} incorrect syntax: ${currentSettings.prefix}font (fancy, fancybold, outline, bold, small) (message)`);
  }
}

export = fontCommand;