import config from "./config/config";

import * as TMI from "tmi.js";
const pb = require("@madelsberger/pausebuffer");
import mariadb from "mariadb";
import { initChannelSettings } from "./utils/start";

import onChatEvent from "./events/onChatEvent/onChatEvent";
export const pool = mariadb.createPool({
  host: config.MariaDB.host,
  user: config.MariaDB.user,
  password: config.MariaDB.password,
  database: config.MariaDB.database,
  connectionLimit: config.MariaDB.connectionLimit
});

export let channelsToJoin: string[] = [];
(async function () {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = await conn.query('SELECT username FROM channels;');
    query.forEach((channel: any) => {
      channelsToJoin.push(channel.username);
    });
  } catch (err) {
    throw err;
  } finally {
    if (conn) return conn.end();
  }
})();

const client = pb.wrap(new TMI.client({
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

client.connect().then(async () => {
  await initChannelSettings();
});

client.on("chat", async (channel: string, userstate: TMI.Userstate, message: string, self: boolean) => await onChatEvent(client, channel, userstate, message, self));