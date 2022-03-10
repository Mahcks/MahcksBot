import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getAllChatters, getOptedOutUsers, randomArray, randomChatter, removeUsersOptedOut } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const looserCommand: CommandInt = {
  Name: "loser",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "lmao what a loser.",
  DynamicDescription: [
    "By default it chooses a random user in the current viewer list. You can also specifiy a user to tag.",
    "<code>!loser</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: true,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let template = 'GUYS GUYS LOOK! LOOK GUYS! THERE IS A HUGE LOSER IN CHAT AND HIS NAME IS 🔔 {USER} HAHAHA LOOK AT THAT FUCKING LOSER XDDD'
    if (context[0]) {
      sendMessage(client, channel, template.replace('{USER}', context[0]));
    } else {
      let clean = await removeUsersOptedOut(await getAllChatters(channel), await getOptedOutUsers(looserCommand.Name));
      let random = await randomArray(clean);
      sendMessage(client, channel, template.replace('{USER}', random));
    }
  }
}

export = looserCommand;