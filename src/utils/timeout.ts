import { redis } from "../main";
import { findQuery, insertRow, removeOne, sqlQuery } from "./maria";

// Fetches all bans and stores them.
export async function initUserBans() {
  let bans = await findQuery('SELECT * FROM user_bans;', []);
  bans.forEach((ban: any) => {
    redis.sadd(`user_bans:${ban.channel}`, ban.uid);
  });
}

// Executes when user is banned from a channel.
export async function userBanned(channel: string, username: string, reason: null, userstate: any) {
  await insertRow('INSERT INTO user_bans (cid, channel, uid, username, timestamp, unbanned, updated) VALUES (?, ?, ?, ?, ?, ?, ?);',
    [parseInt(userstate['room-id']), channel.replace('#', ''), parseInt(userstate["target-user-id"]), username, new Date(), 0, new Date()]);
  redis.sadd(`user_bans:${channel.replace('#', '')}`, parseInt(userstate["target-user-id"]));
}

// Remove UID from cache and set the user's unban status to true in the table.
async function userUnbanned(channel: string, uid: number) {
  await sqlQuery('UPDATE user_bans SET unbanned=?, updated=? WHERE channel=? AND uid=? ORDER BY timestamp DESC LIMIT 1;', [1, new Date(), channel, uid]);
  redis.srem(`user_bans:${channel.replace('#', '')}`, uid);
}

// Checks if a user is banned from a channel when they chat.
// This is done because there is no easy way without permission to get the unban event.
export async function isUserBannedInChannel(uid: number, channel: string) {
  console.log(channel.replace("#", ""));
  redis.smembers(`user_bans:${channel.replace('#', '')}`, function (err, reply) {
    if (reply.includes(uid.toString())) {
      userUnbanned(channel.replace('#', ''), uid);
    }
  });
}