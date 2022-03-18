import * as TMI from "tmi.js";
import * as path from "path";
import * as fs from 'fs';
import { logPool } from "../../main";
import { findQuery } from "../../utils/maria";

/* 

  Create a local database on Appa server
  Store logs from there

  Channels to log
  ["moonmoon", "cyr", "trainwreckstv", "forsen", "pokelawls", "erobb221"]

*/

export const loggedMarkovChannels: string[] = ["moonmoon", "cyr", "trainwreckstv", "forsen", "pokelawls", "erobb221"];
const months: string[] = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/* 

    let year = new Date().getUTCFullYear();
    let yDir = path.join(__dirname, '../../test-data/' + year);
    if (!fs.existsSync(yDir)) {
      fs.mkdirSync(yDir, { recursive: true });
    }

    let dir = path.join(__dirname, '../../test-data/' + year + "/" + channel)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });

      months.forEach(month => {
        let mDir = path.join(__dirname, "../../test-data/" + year + "/" + channel + "/" + month);
        if (!fs.existsSync(mDir)) {
          fs.mkdirSync(mDir, { recursive: true });
        }
      });
    }

*/

// Checks if the streamer has their own folder yet for channel logs.
const checkForChannelTable = (channels: string[]) => {
  channels.forEach(channel => {
    logPool.query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=? AND table_name=?", ["logs", channel], (err, res) => {
      if (err) console.log(err);
      let exists = Boolean(res[0]['COUNT(*)']);
      if (!exists) {
        logPool.query(`CREATE TABLE logs.${channel} (timestamp timestamp, username varchar(255), message varchar(505))`);
      }
    })
  });
}

// Logs message for that channel.
export const logMessageForChannel = (channel: string, username: string, message: string) => {
  let timestamp = new Date();
  logPool.query(`INSERT INTO logs.${channel} (timestamp, username, message) VALUES (?, ?, ?)`, [timestamp, username, message], (err, result) => {
    if (err) return console.log(err);
  });
}

// Initializes the logger module.
export const initLogClient = async () => {
  console.log("!LOGGER HAS STARTED!")

  let loggedChannels: string[] = [];
  loggedChannels.push(...loggedMarkovChannels);
  const uQuery = await findQuery('SELECT username FROM channels;', []);
  uQuery.forEach((channel: any) => {
    loggedChannels.push(channel.username);
  });

  checkForChannelTable(loggedChannels);

  const lClient = new TMI.client({
    channels: loggedChannels,
    options: {
      debug: false
    }
  });

  lClient.connect();

  lClient.on('message', (channel: string, userstate: TMI.Userstate, message: string, self: boolean) => {
    logMessageForChannel(channel.substring(1), userstate['username'], message);
  });
}

