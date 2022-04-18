import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { humanizeNumber, pickNumberBetweenRange, randomArray } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";
const WYR = require("either-wyr");

const wouldyouratherCommand: CommandInt = {
  Name: "wouldyourather",
  Aliases: ['wyr', 'wur'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Generates a would you rather question.",
  DynamicDescription: [
    "<code>mb wouldyourather</code>",
    "<code>mb wyr</code>",
    "<code>mb wur</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    let apiList = [
      {
        name: "abaan",
        link: "https://would-you-rather-api.abaanshanid.repl.co/"
      },
      {
        name: "aakhilv",
        link: "https://api.aakhilv.me/fun/wyr?num=1"
      },
      {
        name: "either",
        link: ""
      }
    ];

    let toGet = randomArray(apiList);

    /* try {
      let res;
      switch (toGet.name) {
        case "abaan":
          res = await axios.get(toGet.link);
          sendMessage(channel, `@${user} ${res.data.data}`);
          break;

        case "aakhilv":
          res = await axios.get(toGet.link);
          sendMessage(channel, `@${user} ${res.data[0]}`);
          break;

        case "either":
          let wyr = WYR();
          console.log(wyr);
      }
    } catch (err) {
      sendMessage(channel, `@${user} there was an error fetching a question. Please try again later FeelsDankMan`);
    } */
    let wyr = await WYR();
    if (context.includes("-stats")) return sendMessage(channel, `🤔 Would you rather ${wyr.questions[0].question.toLowerCase()} [${humanizeNumber(wyr.questions[0].votes)} | ${wyr.questions[0].percentage}%] or ${wyr.questions[1].question.toLowerCase()} [${humanizeNumber(wyr.questions[1].votes)} | ${wyr.questions[1].percentage}%]`);
    sendMessage(channel, `🤔 Would you rather ${wyr.questions[0].question.toLowerCase()} or ${wyr.questions[1].question.toLowerCase()}`);
  }
}

export = wouldyouratherCommand;