import { Actions } from "tmi.js";
import config from "../../config/config";
import { client, redis } from "../../main";
import updateRateLimit from "./updateRateLimit";

/* 
  = Rate Limits = 
  Viewer - 20 messages per 30 seconds 
  Moderator - 100 messages per 30 seconds
*/

let alternate = false;
export default async (channel: string, message: string) => {
  channel = channel.replace("#", '');
  let settings = await redis.get(channel);
  if (!settings) return console.log("[Send Message] Can't send message due to no settings.");
  let data = JSON.parse(settings);
  let role = data.role;

  if (config.production && channel === "mahcksimus") return;
  if (role === "moderator" || role === "broadcaster") {
    let rateLimited = await updateRateLimit(channel, 'moderator');
    if (rateLimited) return client.say(channel, message);
  } else {
    let rateLimited = await updateRateLimit(channel, 'viewer');
    if (rateLimited) {
      let msg = (alternate) ? message.concat(" 󠀀") : message;
      (alternate) ? alternate = false : alternate = true;
      client.say(channel, msg);
    }
  }
}
