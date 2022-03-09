import { Actions, Userstate } from "tmi.js";
import { getTarget, fetchAPI, calcDate } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const modcheckCommand: CommandInt = {
  Name: "modcheck",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "This command tells you if a user is a mod in a given channel, and for how long. It defaults to the current channel.",
  DynamicDescription: [
    "Check if a user is moderator in Esfand's chat.",
    "<code>!modcheck (user)</code>",
    "",
    "Check if a user is moderator in another channel.",
    "<code>!modcheck (user) (channel)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;
    let rTarget = target.toLowerCase();

    let targetChannel = context[1];
    if (!targetChannel) targetChannel = channel.substring(1);
    if (targetChannel.startsWith("@")) {
      targetChannel = targetChannel.substring(1);
    } else targetChannel = targetChannel;

    let modCheck;
    try {
      modCheck = await fetchAPI(`https://api.ivr.fi/twitch/modsvips/${targetChannel}`);
    } catch (error) {
      //await logError(user!, 'api', `Error fetching API for !modcheck - https://api.ivr.fi/twitch/modsvips/${targetChannel}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    let isMod = modCheck["mods"];
    let modRes = "";

    await isMod.forEach(async function (modstatus: any) {
      if (modstatus.login == rTarget) {
        let modDate = modstatus.grantedAt;
        modRes = `that user has been a mod in "${targetChannel}" for - ${calcDate(new Date(), new Date(modDate), ['m', 's'])}`;
      }
    });
    
    if (modRes != "") {
      client.action(channel, `@${user} ${modRes}`);
    } else return client.action(channel, `@${user} that user is not a mod in "${targetChannel}"`);
  }
}

export = modcheckCommand;