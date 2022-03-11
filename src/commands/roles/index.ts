import { Actions, Userstate } from "tmi.js";
import { getTarget } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const rolesCommand: CommandInt = {
  Name: "roles",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Check your own or another users roles.",
  DynamicDescription: [
    "<code>!roles</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let target = getTarget(user, context[0]);

    let link;
    try {
      link = `https://twitchdatabase.com/roles/${target}`;
    } catch (error) {
      //await logError(user!, 'api', `Error fetching API for !roles - https://twitchdatabase.com/roles/${target}`, new Date());
      return client.action(channel, `@${user} FeelsDankMan sorry, there was an API issue please contact Mahcksimus.`);
    }

    let response = (user === target) ? `here are your roles: ${link}` : `here are ${target}'s roles: ${link}`;
    client.action(channel, `@${user} ${response}`);
  }
}

export = rolesCommand;