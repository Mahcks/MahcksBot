import { Actions, Userstate } from "tmi.js";
import config from "../../config/config";
import runCommand from "../../modules/run-command";
import { isMod, logMessage, updateOrCreateChatter } from "../../utils";
import { getChannelSettings } from "../../utils/start";

export default async (client: Actions, channel: string, userstate: Userstate, message: string, self: boolean) => {
  if (self) {
    // TODO: store this in redius.
    await isMod(userstate, channel)
  }

  if (config.production) {
    if (channel === "#pajlada") {
      if (message == "pajaGIGA 🚨 ALERT" && userstate["user-id"] === "743355647") {
        client.action(channel, 'ppL 📣 🚨 ᵃˡᵉʳᵗ');
      }
    }
  }

  const foundSettings = await getChannelSettings(channel);

  if (message.startsWith('!')) {
    if (message.includes('mahcksbot')) {
      return client.action(channel, `@${userstate['display-name']} I'm a bot programmed by Mahcksimus and written in TypeScript. My prefix here is ${foundSettings.prefix}`);
    }
  }

  if (foundSettings) {
    if (message.startsWith(foundSettings.prefix)) {
      runCommand(client, channel, userstate, message);
    }
  } else return;

  // Save/update chatter in table
  await updateOrCreateChatter(userstate);

  await logMessage(channel.substring(1), parseInt(userstate['user-id']!), userstate['username'], message, new Date());
}