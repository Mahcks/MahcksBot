import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { capitalizeFirstLetter, fetchAPI } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";

const WowPopulationCommand: CommandInt = {
  Name: "wowpopulation",
  Aliases: ["wowpop"],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Shows the amount of players that have raided and have uploaded their raid logs to WarcraftLogs. Currently only supports TBC servers.",
  DynamicDescription: [
    "<code>mb wowpopulation</code>",
    "<code>mb wowpop</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const server = context[0];
    try {
      let res;
      try {
        res = await fetchAPI(`https://ironforge.pro/api/server/tbc/${server}`);
        if (res.error) return sendMessage(channel, `@${userstate.username} ${res.defaultMessage}`);
      } catch (error) {
        return sendMessage(channel, `${userstate.username} FeelsDankMan sorry, there was an API issue, please try again later.`);
      }

      let allData = res.data.charts.all.datasets;
      let factionData: any = { aliance: 0, horde: 0 }

      allData.forEach((faction: any) => {
        let fData: any[] = faction.data;
        if (faction.label.toLowerCase() === "alliance") {
          factionData.aliance = fData.pop();
        } else {
          factionData.horde = fData.pop();
        }
      });

      let totalPlayers = factionData.aliance + factionData.horde;
      let aliancePerc = ((factionData.aliance / totalPlayers) * 100).toFixed(2);
      let horderPerc = ((factionData.horde / totalPlayers) * 100).toFixed(2);
      client.say(channel, `@${userstate.username} ${capitalizeFirstLetter(server)} population - Aliance: %${aliancePerc}/${factionData["aliance"].toLocaleString()} | Horde %${horderPerc}/${factionData["horde"].toLocaleString()}`);
    } catch (err) {
      client.say(channel, `@${userstate.username} there was an error fetching data for "${capitalizeFirstLetter(server)}"`);
    }
  }
}

export = WowPopulationCommand;