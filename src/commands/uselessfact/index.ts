import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { fetchAPI, randomArray } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const UselessFactCommand: CommandInt = {
  Name: "uselessfact",
  Aliases: ["ufact"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "A fact. Useless but, a fact.",
  DynamicDescription: [
    "<code>mb uselessfact</code>",
    "<code>mb ufact</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const apis = [{ name: "uselessfacts", link: "https://uselessfacts.jsph.pl/random.json?language=en" }, { name: "funfact", link: "https://api.aakhilv.me/fun/facts?num=1'" }, { name: "asli", link: "https://asli-fun-fact-api.herokuapp.com/" }];
    let randomApi = randomArray(apis);

    try {
      let response = await fetchAPI(randomApi["link"]);
      if (response.error) return sendMessage(channel, `@${userstate.username} ${response.defaultMessage}`);
      if (randomApi.name === "funfact") {
        return sendMessage(channel, `@${userstate.username} ${response.data[0]}`);
      } else if (randomApi.name === "asli") {
        return sendMessage(channel, `@${userstate.username} ${response.data.data.fact}`);
      } else {
        sendMessage(channel, `@${userstate.username} ${response.data.text}`);
      }

    } catch (error) {
      return sendMessage(channel, `@${userstate.username} FeelsDankMan sorry, there was API issue. Please try again later.`)
    }
  }
}

export = UselessFactCommand;