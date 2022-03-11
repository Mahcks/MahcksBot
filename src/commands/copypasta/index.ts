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
    "<code>!copypasta</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const maxTries = 5;

    let quotes = [
      `Anyways, um... I bought a whole bunch of shungite rocks, do you know what shungite is? Anybody know what shungite is? No, not Suge Knight, I think he's locked up in prison. I'm talkin' shungite. Anyways, it's a two billion year-old like, rock stone that protects against frequencies and unwanted frequencies that may be traveling in the air. That's my story, I bought a whole bunch of stuff. Put 'em around the la casa. Little pyramids, stuff like that. forsenCD`,
      `Just because... I had a dream of being pounded in the ass, and I was aroused when I woke up, doesn't make me gay. It was fuckin' hot, ok? A big ass 6 foot 5 WEREWOLF lookin' guy with huge muscles bear-hugged me, HUH HUH HUH HUH HUH, and I was just, face against the glass OOO smack OOO smack UUHH smack OOO smack OOK smack OOO, and I woke up aroused. That doesn't make me gay. I don't think it's GAY to wake up aroused. I-I think that it was just hot. It was fucking hot TRUEING`,
      '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ imGlitch You have received a COCK Okayge 👍 imGlitch ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
      '📜 ✍ ️ Okayge 𝓑𝓻𝓸𝓽𝓱𝓮𝓻 𝓘 𝓻𝓮𝓬𝓮𝓲𝓿𝓮𝓭 𝔂𝓸𝓾𝓻 𝓶𝓮𝓼𝓼𝓪𝓰𝓮 𝔀𝓮𝓵𝓵. 𝓘𝓽 𝓮𝔁𝓬𝓲𝓽𝓮𝓼 𝓶𝓮 𝓽𝓸 𝓲𝓷𝓯𝓸𝓻𝓶 𝔂𝓸𝓾 𝓪𝓫𝓸𝓾𝓽 𝓪 𝓬𝓸𝓬𝓴 𝓻𝓮𝓼𝓮𝓻𝓿𝓮, 𝓯𝓻𝓮𝓽 𝓷𝓸𝓽, 𝓬𝓸𝓬𝓴 𝔀𝓲𝓵𝓵 𝓫𝓮 𝓼𝓮𝓷𝓽 𝔂𝓸𝓾𝓻 𝔀𝓪𝔂 𝓼𝓸𝓸𝓷.',
      '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ imGlitch You have lost COCK imGlitch ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
      "ᴡʜᴇɴ ɪ'ᴍ ʀᴇᴀᴅʏ ᴛᴏ ɢᴏ ᴛᴏ sʟᴇᴇᴘ ɪ ɢʀᴀʙ ᴍʏ ʟᴀᴘᴛᴏᴘ ᴀɴᴅ ɢᴇᴛ ɪɴ ʙᴇᴅ. ɪ ᴏᴘᴇɴ ᴍʏ ʟᴀᴘᴛᴏᴘ, ɢᴏ ᴛᴏ ᴇsғᴀɴᴅ's sᴛʀᴇᴀᴍ, ᴛᴜʀɴ ᴜᴘ ᴛʜᴇ ʙʀɪɢʜᴛɴᴇss ᴀʟʟ ᴛʜᴇ ᴡᴀʏ ᴜᴘ ᴀɴᴅ ᴡᴀᴛᴄʜ ᴛʜᴇ sᴛʀᴇᴀᴍ ᴡɪᴛʜ ᴛʜᴇ ʟᴀᴘᴛᴏᴘ sᴄʀᴇᴇɴ ᴄʟᴏsᴇ ᴛᴏ ᴍʏ ᴇʏᴇs. ᴡʜᴇɴ ᴛʜᴇ sᴛʀᴇᴀᴍ ɪs ᴅᴏɴᴇ ɪ ᴄʟᴏsᴇ ᴍʏ ᴇʏᴇs ᴀɴᴅ ᴄᴀɴ sᴛɪʟʟ sᴇᴇ ᴇsғᴀɴᴅ's ғᴀᴄᴇ ᴡʜɪʟᴇ ɪ ɢᴏ ᴛᴏ sʟᴇᴇᴘ. ɪᴛ's ᴛʜᴇ ᴏɴʟʏ ᴡᴀʏ ɪ ᴄᴀɴ ғᴇᴇʟ sᴀғᴇ.",
      "Guys can you please not spam the chat. My mom bought me this new laptop and it gets really hot when the chat is being spamed. Now my leg is starting to hurt because it is getting so hot. Please, if you don't want me to get burned, then dont spam the chat",
      
    ]

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