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
    let userLookup = await resolveUser(target.toLowerCase());

    function getBadges(badges: any[]) {
      let total: string[] = [];
      badges.forEach((badge) => {
        total.push(badge.title);
      });

      return total;
    }

    let usersSettings: UserSettings = {
      id: (isSelf) ? userstate['user-id'] : userLookup.id,
      chatColor: (userLookup.chatColor === undefined) ? '[None]' : userLookup.chatColor,
      badge: (userLookup.badge.length === 0) ? '[None]' : getBadges(userLookup.badge),
      created: calcDate(new Date(), new Date(userLookup['createdAt']), ['m'])
    }

    if (target.toLowerCase() === userstate.username) {
      sendMessage(channel, `@${user} ID: ${usersSettings.id} chat color: ${usersSettings.chatColor} (${await getColorName(usersSettings.chatColor)}) badge: ${usersSettings.badge} created: ${usersSettings.created}`);
    } else {
      sendMessage(channel, `@${user} ID: ${usersSettings.id} chat color: ${usersSettings.chatColor} (${await getColorName(usersSettings.chatColor)}) badge: ${usersSettings.badge} created: ${usersSettings.created}`);
    }
  }
}

export = whoisCommand;