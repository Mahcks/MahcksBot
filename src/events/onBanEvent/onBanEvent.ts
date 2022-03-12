import { Actions } from "tmi.js";
import { insertRow } from "../../utils/maria";
import { userBanned } from "../../utils/timeout";

// Reason will always be null. To get the reason and other data, use PubSub topic "chat_moderator_actions"
export default async (client: Actions, channel: string, username: string, reason: null, userstate: any) => {
  await userBanned(channel, username, reason, userstate);
}