import { Actions, Userstate } from "tmi.js";
import { randomArray } from "../../utils";
import GameUtils from "../../utils/games/gameHandler";
import { CommandInt } from "../../validation/ComandSchema";

const exampleCommand: CommandInt = {
  Name: "rps",
  Aliases: ["rockpaperscissors"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Play a game of rock, paper, scissors vs the bot or another user.",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    let vs = (context[0]) ? context[0] : "cpu";
    let action = context[1];
    let possibleActions = ["rock", "paper", "scissors"];

    let botAction = randomArray(possibleActions);

    if (vs === "cpu" || context[0] === "computer" || context[0] === "cpu" || context[0] === "pc") {

    }
  }
}

export = exampleCommand;