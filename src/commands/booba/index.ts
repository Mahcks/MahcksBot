import axios from "axios";
import { Actions, Userstate } from "tmi.js";
import sendMessage from "../../modules/send-message/sendMessage";
import { randomArray } from "../../utils";
import { CommandInt } from "../../validation/ComandSchema";
import * as nanoid from 'nanoid';

const exampleCommand: CommandInt = {
  Name: "booba",
  Aliases: ['boobatv'],
  Permissions: [],
  GlobalCooldown: 10,
  Cooldown: 30,
  Description: "Get some stream information thanks to booba.tv",
  DynamicDescription: [
    "<code></code>"
  ],
  Testing: false,
  OfflineOnly: false,
  OnlineOnly: false,
  Optout: false,
  Code: async (client: Actions, channel: string, userstate: Userstate, context: any[]) => {
	const user = userstate.username;

  const boobas = await axios.get('https://api.booba.tv/');
  let data = boobas.data;

  const booba = randomArray(data);

  sendMessage(channel, `@${user} ${booba.user_display_name.toLowerCase() === booba.user_login ? booba.user_display_name : booba.user_login} ${booba.stream_viewer_count} viewers - ${booba.stream_thumbnail_url.replace('{width}', '1920').replace('{height}', '1080')}?${nanoid.nanoid(4)}`);
  }
}

export = exampleCommand;