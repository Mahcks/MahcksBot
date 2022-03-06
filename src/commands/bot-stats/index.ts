import { Actions, Userstate } from "tmi.js";
import { getTarget, humanizeNumber } from "../../utils";
import { findQuery } from "../../utils/maria";
import { CommandInt } from "../../validation/ComandSchema";
import { execSync } from "child_process";
import sendMessage from "../../modules/send-message/sendMessage";

const botstatsCommand: CommandInt = {
  Name: "botstats",
  Aliases: ["botstatus"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Gives some stats about the bot.",
  DynamicDescription: [
    "<code>Get some stats about the bot.</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate["username"];
    const target = getTarget(user, context[0]);

    const totalChatters = await findQuery('SELECT count(*) FROM chatters;', []);
    const totalCmds = await findQuery('SELECT count(*) FROM commands;', []);

    const commits = await execSync("git rev-list --all --count");

    sendMessage(client, false, channel, `@${target} total commands: ${humanizeNumber(parseInt(totalCmds[0]['count(*)']))}, chatters logged: ${humanizeNumber(parseInt(totalChatters[0]['count(*)']))} commits farmed: ${humanizeNumber(parseInt(commits.toString('utf-8').replace("\n", "")))}`);
  }
}

export = botstatsCommand;