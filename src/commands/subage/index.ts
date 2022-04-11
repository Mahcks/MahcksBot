import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { calcDate, fetchAPI, getTarget } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const SubageCommand: CommandInt = {
  Name: "subage",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check the time a given user has subbed to a given channel along with other information. (By default targets to the channel the command is ran in.)",
  DynamicDescription: [
    "If no channel is given it will default to the current channel.",
    "",
    "Check your subage to the current channel.",
    "<code>!subage (YourUsername)</code>",
    "",
    "Check subage for another user in the current channel.",
    "<code>!subage (user)</code>",
    "",
    "Check your subage to a channel.",
    `<code>!subage (YourUsername) (Streamer)</code>`,
    "",
    "Check another users subage to a channel.",
    "<code>!subage (user) (streamer)</code>",
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let target = getTarget(user, context[0]);
    target = (target.startsWith("@")) ? target.substring(1) : target;

    let targetChannel = context[1];
    if (!targetChannel) targetChannel = channel.replace("#", "");
    targetChannel = targetChannel.replace("@", "");

    let subcheck;
    
    try {
      subcheck = await fetchAPI(`https://api.ivr.fi/twitch/subage/${target.toLowerCase()}/${targetChannel.toLowerCase()}`);
      if (subcheck.error) return sendMessage(channel, subcheck.data);
    } catch (error) {
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please try again later.`);
    }

    if (subcheck.data.subscribed == false) {
      let oldSub = subcheck.data.cumulative;
      if (oldSub.months === 0 || typeof oldSub.months === "undefined") {
        return client.action(channel, `${target} is not subbed to ${targetChannel} and never has subbed to them.`);
      } else {
        return client.action(channel, `${target} is not subbed to ${targetChannel} but has been previously for a total of ${oldSub.months} months. Sub ended ${calcDate(new Date(), new Date(oldSub.end), ['s'])} ago.`);
      }
    } else {
      let subData = subcheck.data.meta;
      let subLength = subcheck.data.cumulative;
      let substreak = subcheck.data.streak;

      if (subData === undefined) return client.action(channel, `@${user} "${target}" or "${targetChannel}" is not a valid username.`);

      if (subData.tier === "Custom") {
        return client.action(channel, `${target} is subbed to #${targetChannel} with a permanent sub and has been subbed for a total of ${subLength.months} months! They are currently on a ${substreak.months} months streak.`);
      }
      if (subData.endsAt === null) {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData.tier} sub and has been subbed for a total of ${subLength.months} months! They are currently on a ${substreak.months} months streak. This is a permanent sub.`);
      }
      if (subData.type === "prime") {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier 1 prime sub and has been subbed for a total of ${subLength.months} months! They are currently on a ${substreak.months} months streak. The sub ends/renews in ${calcDate(new Date(subData.endsAt), new Date(), ['s'])}`);
      }
      if (subData.type === "paid") {
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData.tier} sub and has been subbed for a total of ${subLength.months} months! They are currently on a ${substreak.months} months streak. The sub ends/renews in ${calcDate(new Date(subData.endsAt), new Date(), ['s'])}`);
      }
      if (subData.type === "gift") {
        let gifter = subData.gift.name;
        return client.action(channel, `${target} is currently subbed to ${targetChannel} with a Tier ${subData.tier} sub, gifted by ${gifter} for a total of ${subLength.months} months! They are currently on a ${substreak.months} months streak. The sub ends/renews in ${calcDate(new Date(subData.endsAt), new Date(), ['s'])}`);
      }
    }
  }
}

export = SubageCommand;