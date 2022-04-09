import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { TranslatedText, translateText, TranslationObject } from "../../utils/translate";
import { CommandInt } from "../../validation/ComandSchema";

const TranslateCommand: CommandInt = {
  Name: "translate",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Translate to different languages.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let input = context.join(" ");
    let fromRegex = /(from:[^\s]+)/gm;
    let toRegex =  /(to:[^\s]+)/gm;

    let tObject: TranslationObject = {
      from: {
        exists: false,
        search: null,
      },
      to: {
        exists: false,
        search: null,
      },
      text: input
    }

    let toExec = toRegex.exec(input);
    if (toExec !== null) {
      tObject.to.search = toExec[0];
      tObject.to.exists = true;
      tObject.text = tObject.text.replace(toRegex, "");
    } 

    let fromExec = fromRegex.exec(input);
    if (fromExec !== null) {
      tObject.from.search = fromExec[0];
      tObject.from.exists = true;
      tObject.text = tObject.text.replace(fromRegex, "");
    }

    let translated = await translateText(tObject);
    sendMessage(channel, `[${translated.translated}] ${translated.text}`);
  }
}

export = TranslateCommand;