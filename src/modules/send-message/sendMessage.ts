import { Actions } from "tmi.js";
import config from "../../config/config";
import { ChannelSettings, getChannelSettings } from "../../utils/start";

interface Roles {
  viewer: RoleLimits;
  vip: RoleLimits;
  moderator: RoleLimits;
  broadcaster: RoleLimits;
}

interface RoleLimits {
  messageCountLimit: number;
  messageCountDuration: number; // for however many countLimit is how many they can send in duration. 
}

const rateLimits: Roles = {
  viewer: {
    messageCountLimit: 20,
    messageCountDuration: 30
  },
  vip: {
    messageCountLimit: 20,
    messageCountDuration: 30
  },
  moderator: {
    messageCountLimit: 100,
    messageCountDuration: 30
  },
  broadcaster: {
    messageCountLimit: 100,
    messageCountDuration: 30
  }
}

let alternate = false;
export default async (client: Actions, isAction: boolean, channel: string, message: string) => {
  if (config.production && channel.substring(1) === "mahcksimus") return;
  let msg = (alternate) ? message.concat(" 󠀀") : message;
  (alternate) ? alternate = false : alternate = true;

  // kinda gets around the 1 second global cooldown for now.
  setTimeout(function() {
    (isAction) ? client.action(channel, msg) : client.say(channel, msg);
  }, 200)
}