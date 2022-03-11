import { Actions, CommonUserstate, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { secondsToHms } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const ping: CommandInt = {
  Name: "ping",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Ping the bot",
  DynamicDescription: [
    "<code>!ping</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let uptime = process.uptime();

    await client.ping().then(function (data) {
      let ping: number = Math.floor(Math.round(data as any * 1000));
      sendMessage(client, channel, `@${userstate.username}, FeelsOkayMan 🏓 Uptime: ${secondsToHms(uptime)} Latency to Twitch IRC: ${ping}ms`);
    });
  }
}

export = ping;