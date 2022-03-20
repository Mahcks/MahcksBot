import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";
import { execSync, exec } from 'child_process';
import { findQuery, sqlQuery } from "../../utils/maria";
import { cacheMarkovMessages } from "../../modules/markov";
import { logPool, redis } from "../../main";

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
      if (res.includes('Already up to date.')) return sendMessage(channel, `@${user} no changes detected.`);
      sendMessage(channel, `@${getChanges(res) || res.join(' | ')}`);

    } else if (cmd === "restart") {
      const res = execSync('git pull').toString().split('\n').filter(Boolean);
      if (res.includes('Already up to date.')) sendMessage(channel, `${user} restarting without any changes.`);
      else sendMessage(channel, `@${user} restarting ${getChanges(res) || res.join(" | ")}`);
      exec('npm run pm2');

    } else if (cmd === "eval") {
      try {
        const ev = await eval('(async () => {' + context.join(" ") + '})()');
        console.log(ev);
        if (ev) sendMessage(channel, `@${user} FeelsOkayMan output: ${String(ev)}`);
      } catch (error) {
        sendMessage(channel, `@${user} FeelsDankMan error: ${error}`);
      }
    } else if (cmd === "sql") {
      context.shift();
      let msg = context.join(" ");

      let values = /\[(.*?)\]/.exec(msg);
      let qString = msg.replace(/\[(.*?)\]/, '');
      let query = await sqlQuery(qString, [values]);

      console.log(query);

    } else if (cmd === "redis") {
      context.shift();
      let search = context.join(" ");
      let q = await redis.get(search);
      console.log(q);

    } else if (cmd === "migrate") {
      let all = await findQuery('SELECT * FROM logs;', []);

      let queries: string[] = [];
      all.forEach((log: any) => {
        if (log.channel === "jayhilaneh") {
          queries.push(log.timestamp, log.username, log.message);
        }
      });

      /* logPool.query(`INSERT INTO logs.jayhilaneh (timestamp, username, message) VALUES ?`, [queries], (err, result) => {
        if (err) return console.log(err);
      }); */
    } else {
      sendMessage(channel, `@${user} invalid option FeelsDankMan`);
    }
  }
}

export = devCommand;