import { Actions, Userstate } from "tmi.js";
import config from "../../config/config";
import runCommand from "../../modules/run-command";
import { logMessage, updateOrCreateChatter } from "../../utils";
import { channelSettings } from "../../utils/start";

export default async (client: Actions, channel: string, userstate: Userstate, message: string, self: boolean) => {
  if (self) return;

  if (config.production) {
    if (channel === "#pajlada") {
      if (message == "pajaGIGA 🚨 ALERT" &&  userstate["user-id"] === "743355647") {
        client.action(channel, 'ppL 📣 🚨 ᵃˡᵉʳᵗ');
      }
    }
  }

  let foundSettings = channelSettings.filter(setting => {
    return setting.username === channel.substring(1);
  });

  if (message.startsWith('!')) {
    if (message.includes('mahcksbot')) {
      return client.action(channel, `@${userstate['display-name']} I'm a bot programmed by Mahcksimus and written in TypeScript. My prefix here is ${foundSettings[0].prefix}`);
    }
  }

  if (foundSettings[0]) {
    if (message.startsWith(foundSettings[0].prefix)) {
      runCommand(client, channel, userstate, message);
    }
  } else return;

  // Save/update chatter in table
    await updateOrCreateChatter(userstate);

    await logMessage(channel.substring(1), parseInt(userstate['user-id']!), userstate['username'], message, new Date());
}