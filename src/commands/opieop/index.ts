import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { CommandInt } from "../../validation/ComandSchema";

const opieopCommand: CommandInt = {
  Name: "opieop",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Sends a good looking dish along with the recipe.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;

    try {
      const res = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
      let data = res.data.meals[0];
      sendMessage(channel, `@${user} ${data.strMeal} (${data.strCategory} | ${data.strArea}) ${data.strSource}`);
    } catch (err) {
      sendMessage(channel, `@${user} error fetching the API for this command. Please try again later. FeelsDankMan`);
    }
  }
}

export = opieopCommand;