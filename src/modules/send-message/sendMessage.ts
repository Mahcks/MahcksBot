import { Actions } from "tmi.js";
import config from "../../config/config";

export default async (client: Actions, channel: string, message: string) => {
  if (config.production && channel.substring(1) === "mahcksimus") return;

  // kinda gets around the 1 second global cooldown for now.
  client.say(channel, message);
}