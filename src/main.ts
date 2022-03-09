import config from "./config/config";

import * as TMI from "tmi.js";
const pb = require("@madelsberger/pausebuffer");
import mariadb from "mariadb";
import { initChannelSettings } from "./utils/start";

// MariaDB connection
export const pool = mariadb.createPool({
  host: config.MariaDB.host,
  user: config.MariaDB.user,
  password: config.MariaDB.password,
  database: config.MariaDB.database,
  connectionLimit: config.MariaDB.connectionLimit
});

// Redis
const Redis = require('ioredis');
export const redis: Redis = new Redis();

export let channelsToJoin: string[] = [];

const client = new pb.wrap(new TMI.client({
  options: {
    debug: true
  },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: "mahcksbot",
    password: config.tmiOptions.identity.password
  },
  channels: channelsToJoin
}));

client.setMessageCountLimit(20);
client.setMessageCountDuration(30);
client.setThrottle({
	high: 1000,
	low: 500
});


(async function () {
  if (config.production) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = await conn.query('SELECT username FROM channels;');
      query.forEach((channel: any) => {
        channelsToJoin.push(channel.username);
      });
      channelsToJoin.push('pajlada');
    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  } else channelsToJoin.push('mahcksimus')
})();

client.connect().then(async () => {
  await initChannelSettings();
});

import onChatEvent from "./events/onChatEvent/onChatEvent";
import openEmoteListeners, { fetchAndStoreEmotes } from "./modules/emote-listener";
import cron from 'node-cron';
import { Redis } from "ioredis";
client.on("chat", async (channel: string, userstate: TMI.Userstate, message: string, self: boolean) => await onChatEvent(client, channel, userstate, message, self));

(async () => {
  // Opens emote listener
  await openEmoteListeners();

  // Fetches emotes every 3 hours.
  cron.schedule('0 */3 * * *', async() => {
    await fetchAndStoreEmotes();
  })
})();

