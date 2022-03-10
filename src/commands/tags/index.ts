import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTags } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";

const tagsCommand: CommandInt = {
  Name: "tags",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Display all tags for any stream. By default it targets the current channel.",
  DynamicDescription: [
    "Gets the current tags of the channel the bot is in, otherwise input a specific channnel.",
    "<code>!tags (channel)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    let target = (context[0]) ? context[0] : channel.substring(1);
    let tags = await getTags(target);
    let msg = (tags.length === 0) ? `@${user} that user doesn't have any active tags.` : `@${user} tags for that channel: ${tags.join(", ")}`;
    sendMessage(client, channel, msg);
  }
}

export = tagsCommand;