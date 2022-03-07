import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import { CommandInt } from "../../validation/ComandSchema";

const dadjokeCommand: CommandInt = {
  Name: "dadjoke",
  Aliases: ["yodad"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "4Head",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    axios("https://icanhazdadjoke.com/", { method: "GET", headers: { Accept: "application/json", "User-Agent": "axios 0.21.1" } })
    .then(res => {
      client.action(channel, `@${userstate["display-name"]} ${res["data"]["joke"]}`);
    })  
    .catch(async (err) => {
      //await logError(userstate["display-name"]!, 'api', `Error fetching dadjokes from https://icanhazdadjoke.com/`, new Date());
      client.action(channel, `@${userstate["display-name"]} FeelsDankMan sorry, there was an API issue please try again later.`);
    });
  }
}

export = dadjokeCommand;