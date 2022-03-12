import { insertRow } from "../../utils/maria"

export default async (channel: string, username: string, reason: null, duration: number, userstate: any) => {
  await insertRow('INSERT INTO user_timeouts (cid, channel, uid, username, duration, timestamp) VALUES (?, ?, ?, ?, ?, ?)', 
  [parseInt(userstate["room-id"]), channel.replace('#', ''), parseInt(userstate["target-user-id"]), username, duration, new Date()]);
}