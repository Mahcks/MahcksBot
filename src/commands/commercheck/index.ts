import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { getTarget } from "../../utils";
import { getUsersFollowers } from "../../utils/helix";
import { CommandInt } from "../../validation/ComandSchema";

interface BoobaStreamer {
  count: number;
  list: string[];
}

const CoomerCheckCommand: CommandInt = {
  Name: "coomercheck",
  Aliases: [],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Checks the following list of a user to see if there's any matches.",
  DynamicDescription: [
    "<code>mb coomercheck (user)</code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
    const user = userstate.username;
    const target = getTarget(user, context[0]);

    const streamers = [
      "adrianachechik_",
      "thenicolet",
      "sharonqueen",
      "hottea",
      "pekeasmr",
      "gemmastw",
      "xoaeriel",
      "elisabetetv",
      "mistressmord",
      "victorias",
      "castaway",
      "shyphoebe",
      "intraventus",
      "seolyihyeon",
      "basicbimboo",
      "corneliusthecat",
      "cluelo",
      "peachling",
      "madisongordonx",
      "jjolbi1987",
      "olgasparkz",
      "shulamonroe",
      "pinkfloweremoji",
      "rhinospiritx",
      "paris_rain",
      "kayleerosevera",
      "scrimxo",
      "amouranth",
      "aurorastarr",
      "bunlord666",
      "elena_fn",
      "sharonwinner",
      "tiffy",
      "chanice_bonner",
      "oneandonlybbx",
      "crystal",
      "stpeach",
      "alinity",
      "ibabyrainbow",
      "meowko",
      "faith",
      "firedancer",
      "gavrilka",
      "chickenwingcandy",
      "superliminal",
      "gloriamatvien",
      "thedandangler",
      "varvaria",
      "exohydrax",
      "kiwichka",
      "corinnakopf",
      "jennalynnmeowri",
      "kyootbot",
      "lorraejo",
      "loraveee",
      "mazzybelle",
      "kandyland",
    ];

    const coomerList: BoobaStreamer = {
      count: 0,
      list: []
    };

    const following = await getUsersFollowers(target);
    following.forEach(follow => {
      streamers.forEach(coom => {
        if (follow.streamer.toLowerCase() === coom) {
          coomerList.count++
          coomerList.list.push(coom);
        }
      });
    });

    let msg = (coomerList.count == 0) ? `Not a coomer B) ${coomerList.count}/${streamers.length}` : `follows ${coomerList.count}/${streamers.length} streamers that are checked for: ${coomerList.list.join(", ")}`;
    sendMessage(channel, `@${user} ${msg}`)
  }
}

export = CoomerCheckCommand;