import { Actions, Userstate } from "tmi.js";
import { findQuery } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import { CommandInt } from "../../validation/ComandSchema";

const seventvupdatesCommand: CommandInt = {
  Name: "7tvupdates",
  Aliases: ["7tvu"],
  Permissions: ["broadcaster"],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "7tv updates in chat for anyone who misses the notification from the extension or uses Chatterino.",
  DynamicDescription: [
    "<code>mb 7tvupdates</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    let isEnabled = await getChannelSettings(channel);
    console.log(isEnabled);

  }
}

export = seventvupdatesCommand;