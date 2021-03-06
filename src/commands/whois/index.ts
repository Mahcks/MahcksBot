import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { calcDate, getTarget } from "../../utils";
import { getColorName } from "../../utils/colors";
import { resolveUser } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";

interface UserSettings {
  id: number;
  chatColor: string;
  badge: string[] | string;
  created: string;
  isBanned: string;
}

const whoisCommand: CommandInt = {
  Name: "whois",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check ID, bio, chat color, badge and account age.",
  DynamicDescription: [
    "If no target it will check your own information.",
    "<code>mb whois (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate['display-name'];
    let target = getTarget(user, context[0]);

    let isSelf = (target.toLowerCase() === userstate['username']) ? true : false;
    let userLookupData = await resolveUser(target.toLowerCase());
    if (userLookupData.length === 0) return sendMessage(channel, `@${user} couldn't find that user!`);
    let userLookup = userLookupData[0];

    function getBadges(badges: any[]) {
      let total: string[] = [];
      badges.forEach((badge) => {
        total.push(badge.title);
      });

      return total;
    }

    let usersSettings: UserSettings = {
      id: (isSelf) ? userstate['user-id'] : userLookup.id,
      chatColor: (userLookup.chatColor === undefined) ? '[None]' : (isSelf) ? userstate.color : userLookup.chatColor,
      badge: (userLookup.badges.length === 0) ? '[None]' : getBadges(userLookup.badges),
      isBanned: (userLookup.banned) ? `⛔ (${userLookup.banReason})` : "",
      created: calcDate(new Date(), new Date(userLookup['createdAt']), ['m'])
    }

    sendMessage(channel, `@${user} ID: ${usersSettings.id} chat color: ${usersSettings.chatColor} (${await getColorName(usersSettings.chatColor)}) badge: ${usersSettings.badge} created: ${usersSettings.created} ${usersSettings.isBanned}`);
  }
}

export = whoisCommand;