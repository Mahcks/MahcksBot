import { Actions, Userstate } from "tmi.js";
import runCommand from "../../modules/run-command";
import { updateOrCreateChatter } from "../../utils";
import { channelSettings } from "../../utils/start";

export default async (client: Actions, channel: string, userstate: Userstate, message: string, self: boolean) => {
  if (self) return;

  let foundSettings = channelSettings.filter(setting => {
    return setting.username === channel.substring(1);
  });

  if (message.startsWith('!')) {
    if (message.includes('mahcksbot')) {
      return client.action(channel, `@${userstate['display-name']} I'm a bot programmed by Mahcksimus and written in TypeScript. My prefix here is ${foundSettings[0].prefix}`);
    }
  }

  if (message.startsWith(foundSettings[0].prefix)) {
    runCommand(client, channel, userstate, message);
  }

    // Save/update chatter in table
    await updateOrCreateChatter(userstate);
}