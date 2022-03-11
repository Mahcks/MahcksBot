import { Actions, Userstate } from "tmi.js";
import config from "../../config/config";
import { CommandStore } from "../../store/CommandStore";
import { checkMessageBanPhrase } from "../../utils";
import { cooldownCanContinue } from "../../utils/cooldown";
import isUserPremitted from "../../utils/isUserPremitted";
import { updateOne } from "../../utils/maria";
import { getChannelSettings } from "../../utils/start";
import sendMessage from "../send-message/sendMessage";

const commands = new CommandStore(process.cwd() + "/dist/commands/");

export default async (client: Actions, channel: string, userstate: Userstate, message: string) => {
  const context = message.slice(config.prefix.length).split(/ +/);

  // Removing invis character 7tv uses.
  if (context.includes("󠀀")) { let sevenInd = context.indexOf("󠀀"); context.splice(sevenInd, 1); };
  if (context[0] === "") context.splice(0, 1);

  const commandName = context?.shift()?.toLowerCase();
  const command = commands.getCommand(commandName);

  let checkMessage = await checkMessageBanPhrase(message);
  if (checkMessage === null) return client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry couldn't check for banphrase, try again in a bet FeelsDankMan`);
  if (/(i'm\s12|im\s12|i\sam\s12|am\s12)/gm.test(message)) return;
  if (checkMessage.data.banned) sendMessage(client, channel.substring(1), `[REDACTED] cmonBruh`);

  if (command !== null) {
    let channelSettings = await getChannelSettings(channel.substring(1));
    if (!command) return;

    // If command is disabled for a channel don't run it.
    // TODO: Check the command aliases, if they are ran then handle it the same way.
    if (channelSettings.disabledCommands.length >= 1)
      if (channelSettings.disabledCommands.includes(command.Name)) return client.action(channel, `@${userstate['display-name']} that command is disabled here.`);

    // Check if command is in testing.
    if (command.Testing && !config.testing_channels.includes(channel.substring(1))) return;

    // Offline only command
    if (command.OfflineOnly) {
      // Check if stream is offline
    }

    // Check for global/personal cooldown
    let shouldRun = await cooldownCanContinue(userstate, command.Name, command.Cooldown, command.GlobalCooldown);
    if (!shouldRun) return;

    if (isUserPremitted(userstate, command.Permissions)) {
      if (!config.production) {
        await updateOne('UPDATE commands SET count=count+1 WHERE name=?;', [command.Name]);
        await updateOne('UPDATE chatters SET commandsUsed=commandsUsed+1 WHERE username=?;', [userstate.username]);
      }
      return await command.Code(client, channel, userstate, context);
    } else return await client.say(channel, `@${userstate.username} you don't have permission to use that command.`);
  }
}