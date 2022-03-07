import { Actions } from "tmi.js";
import config from "../../config/config";

let alternate = false;
export default async (client: Actions, channel: string, message: string) => {
  if (message.startsWith("#")) channel = channel.substring(1);
  if (config.production && channel === "mahcksimus") return;
  let msg = (alternate) ? message.concat(" 󠀀") : message;
  (alternate) ? alternate = false : alternate = true;

  // kinda gets around the 1 second global cooldown for now.
  client.say(channel, msg);
}