import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import { CommandInt } from "../../validation/ComandSchema";
import * as cheerio from 'cheerio';
import sendMessage from "../../modules/send-message/sendMessage";

const copyPastaCommand: CommandInt = {
  Name: "copypasta",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Displays a random Twitch related copypasta.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const maxTries = 5;

    async function getCopypasta() {
      const req = await axios.get('https://www.twitchquotes.com/random');
      const html = cheerio.load(req.data);
      const copypasta = html(`div[id^="clipboard_copy_content"]`).text();

      return copypasta;
    }

    let copypasta;
    let tries = 0;
    do {
      copypasta = await getCopypasta();
      tries++;
    } while (copypasta.length > 480 && tries > maxTries);

    if (tries >= maxTries) {
      return sendMessage(client, channel, `@${user} couldn't get a good copypasta after ${tries} tries. FeelsBadMan`);
    }
  
    sendMessage(client, channel, `@${user} ${copypasta || 'No copypasta found FeelsBadMan'}`);
  }
}

export = copyPastaCommand;