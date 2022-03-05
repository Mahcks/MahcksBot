import { Actions, Userstate } from "tmi.js";
import runCommand from "../../modules/run-command";
import { channelSettings } from "../../utils/start";

export default async (client: Actions, channel: string, userstate: Userstate, message: string, self: boolean) => {
  if (self) return;

  let foundSettings = channelSettings.filter(setting => {
    return setting.username === channel.substring(1);
  });

  if (message.startsWith(foundSettings[0].prefix)) {
    runCommand(client, channel, userstate, message);
  }
}