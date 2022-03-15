import { Actions } from "tmi.js";
import config from "../../config/config";

/* 
  = Rate Limits = 
  Viewer - 20 messages per 30 seconds 
  Moderator - 100 messages per 30 seconds
*/

let alternate = false;
export default async (client: Actions, channel: string, message: string) => {
  (message.startsWith("#")) ? channel = channel.substring(1) : channel;
  if (config.production && channel === "mahcksimus") return;
  let msg = (alternate) ? message.concat(" 󠀀") : message;
  (alternate) ? alternate = false : alternate = true;

  // kinda gets around the 1 second global cooldown for now.
  client.say(channel, msg);
}