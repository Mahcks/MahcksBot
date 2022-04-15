import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTarget } from "../../utils";
import { billycoinsGet } from "../../utils/billycoins";
import { CommandInt } from "../../validation/ComandSchema";

const BillyCoinsCommand: CommandInt = {
  Name: "billycoins",
  Aliases: ["billyc", "bcoins", "bc"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "BillyCoin currency system.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const target = getTarget(user, context[0]);

    let currentBalance = await billycoinsGet(parseInt(userstate["user-id"]!));
    let balMessage = ` balance is ${currentBalance}`;
    if (user === target) {
      return sendMessage(channel, `@${user} your ${balMessage}`);
    } else {
      return sendMessage(channel, `@${user} that user's ${balMessage}`);
    }
  }
}

export = BillyCoinsCommand;