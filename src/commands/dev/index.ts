import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";
import { execSync, exec } from 'child_process';

const devCommand: CommandInt = {
  Name: "developer",
  Aliases: ['dev'],
  Permissions: ['developer'],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Allows the developer to fetch updates and restart the bot remotely.",
  DynamicDescription: [
    "Pull the latest update from Github",
    "<code>!dev pull</code>",
    "",
    "Restart the bot and if there's an update it'll pull it and restart it.",
    "<code>!dev restart</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    function getChanges(arr: any[]) {
      return arr.find(value => /files? changed/.test(value));
    }

    const cmd = context[0];
    if (cmd === "pull") {
      const res = execSync('git pull').toString().split('\n').filter(Boolean);
      if (res.includes('Already up to date.')) return sendMessage(client, channel, `@${user} no changes detected.`);
      sendMessage(client, channel, `@${getChanges(res) || res.join(' | ')}`);

    } else if (cmd === "restart") {
      const res = execSync('git pull').toString().split('\n').filter(Boolean);
      if (res.includes('Already up to date.')) sendMessage(client, channel, `${user} restarting without any changes.`);
      else sendMessage(client, channel, `@${user} restarting ${getChanges(res) || res.join(" | ")}`);
      exec('pm2 restart mahcksbot');

    } else if (cmd === "eval") {
      try {
        const ev = await eval('(async () => {' + context.join(" ") + '})()');
        console.log(ev);
        if (ev) sendMessage(client, channel, `@${user} FeelsOkayMan output: ${String(ev)}`);
      } catch (error) {
        sendMessage(client, channel, `@${user} FeelsDankMan error: ${error}`);
      }
    } else {
      sendMessage(client, channel, `@${user} invalid option FeelsDankMan`);
    }
  }
}

export = devCommand;