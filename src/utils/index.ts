import axios, { AxiosError } from "axios";
import moment, { lang } from "moment";
import { Actions, client, Userstate } from "tmi.js";
import config from "../config/config";
import { pool, redis } from "../main";
import { getLocalBanphrases } from "../modules/ban-phrase";
import { EmoteEventUpdate } from "../modules/emote-listener";
import sendMessage from "../modules/send-message/sendMessage";
import { findQuery, insertRow, updateOne } from "./maria";
import { getChannelSettings, updateChannelCache } from "./start";

export function secondsToHms(d: number): string {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);
  let hDisplay = h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
  return hDisplay + mDisplay + sDisplay;
}

export function getUserPermissions(currentUserstate: Userstate) {
  const currentPermsArr = currentUserstate["badges"] == null ? [] : Object.keys(currentUserstate["badges"]);

  return currentPermsArr;
}

export function getTarget(user: any, target: string) {
  let tagged = (target) ? target : user;
  tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;
  return tagged;
}

export function removeFirstWord(str: string) {
  const indexOfSpace = str.indexOf(' ');
  if (indexOfSpace === -1) return '';
  return str.substring(indexOfSpace + 1);
}

type OptionalDateStrings = 's' | 'm' | 'h' | 'd' | 'mo' | 'y';
export function calcDate(startDate: Date, endDate: Date, exclude: OptionalDateStrings[]) {
  var a = moment(startDate);
  var b = moment(endDate);

  let years = a.diff(b, 'year');
  b.add(years, 'years');

  let months = a.diff(b, 'months');
  b.add(months, 'months');

  let days = a.diff(b, 'days');
  b.add(days, 'days');

  let hours = a.diff(b, 'hours');
  b.add(hours, 'hours');

  let minutes = a.diff(b, 'minutes');
  b.add(minutes, 'minutes');

  let seconds = a.diff(b, 'seconds');
  b.add(seconds, 'seconds');

  let dateArr: string[] = [];
  if (!exclude.includes('y'))
    if (years > 0) dateArr.push(years + 'y');

  if (!exclude.includes('mo'))
    if (months > 0) dateArr.push(months + 'mo');

  if (!exclude.includes('d'))
    if (days > 0) dateArr.push(days + 'd');

  if (!exclude.includes('h'))
    if (hours > 0) dateArr.push(hours + 'h');

  if (!exclude.includes('m'))
    if (minutes > 0) dateArr.push(minutes + 'm');

  if (!exclude.includes('s')) {
    if (years < 0) {
      if (seconds > 0) dateArr.push(seconds + "s");
    }
  }

  return dateArr.join(", ")
}

export async function checkMessageBanPhrase(message: string): Promise<boolean> {
  let data = false;

  try {
    let pos = await axios({
      method: 'POST',
      url: `https://cyrbot.com/api/v1/banphrases/test/`,
      headers: { 'Content-Type': 'application/json' },
      data: { message: message }
    });
    let check = await pos.data;
    return check.banned;

  } catch (error) {
    let local = await getLocalBanphrases();

    local.every(phrase => {
      if (new RegExp(phrase.phrase).test(message)) data = true;
    });
  }

  return data;
}

export async function updateOrCreateChatter(userstate: Userstate) {
  let query = await findQuery('SELECT id FROM chatters WHERE username=?;', [userstate['username']]);

  if (!query[0]) {
    let values = [userstate["user-id"], userstate["username"], 0];
    await insertRow(`INSERT INTO chatters (id, username, commandsUsed) VALUES (?, ?, ?);`, values);
  }
}

export function humanizeNumber(number: number) {
  var mainStr: string | undefined = number.toString();
  mainStr = mainStr.split('').reverse().join('');

  mainStr = mainStr.match(/.{1,3}/g)?.join(' ');
  mainStr = mainStr!.split('').reverse().join('');

  return mainStr;
}

/** Transforms a string into a different font.
 * 
 * @param message message to transform
 * @param font font choice from data.ts
 * @returns string of the new message
 */
export function applyFont(message: string, font: any) {
  return message.split("").map(function (c) {
    if (typeof font[c] === "undefined") font[c] = " ";
    return font[c];
  }).join('');
}

export function booleanCheck(bool: string, defaultBool: boolean) {
  if (typeof bool !== "undefined" && (parseInt(bool) === 0 || parseInt(bool) === 1))
    return Boolean(parseInt(bool));
  else return defaultBool;
}

export async function isMod(user: Userstate, channel: string) {
  channel = channel[0] === "#" ? channel.substring(1) : channel;

  let isMod = user.mod || user['user-type'] === "mod";
  let isBroadcaster = channel === user.username;
  let isModUp = isMod || isBroadcaster;

  await updateChannelCache(channel, "role", (isModUp) ? "moderator" : "viewer");

  let storedMod = await redis.get(channel);
  if (!storedMod) return;
  let parsed = JSON.parse(storedMod);

  if (parsed.role === "broadcaster" || parsed.role === "moderator") return true;
  return isModUp;
}

export async function checkIfUserOptedout(id: number, command: string) {
  let query = await findQuery('SELECT * FROM optout WHERE id=?', [id]);
  let toReturn;

  if (query[0]) {
    let cmds = JSON.parse(query[0].commands);
    (cmds.includes(command)) ? toReturn = true : toReturn = false;
  } else toReturn = false;

  return toReturn;
}

export interface APIFetch {
  error: boolean;
  data: any;
  defaultMessage: string;
}

export async function fetchAPI(url: string): Promise<APIFetch> {
  try {
    const response = await axios.get(url);
    return { error: false, data: response.data, defaultMessage: `FeelsDankMan Sorry there was an API error, please try again later.` };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      return { error: true, data: error.response?.data, defaultMessage: `FeelsDankMan Sorry there was an API error, please try again later.` };
    } else {
      return { error: true, data: error, defaultMessage: `FeelsDankMan Sorry there was an API error, please try again later.` };
    }
  }
}

/**
 * Gets all chatters from a specific channel. 
 * 
 * @param channel string Channel you want to get chatters from.
 * @returns string[] Array of strings that contains all the chatters.
 */
export async function getAllChatters(channel: string) {
  (channel.startsWith("#")) ? channel = channel.substring(1) : channel;
  let chatters: string[] = [];

  let chatData = await fetchAPI(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
  if (chatData.error) return [];
  let cd = chatData.data.chatters;
  chatters.push(...cd["broadcaster"], ...cd["moderators"], ...cd["staff"], ...cd["admins"], ...cd["global_mods"], ...cd["viewers"]);
  return chatters;
}

/**
 * 
 * @param channel string Channel to fetch chatters from.
 * @param id number ID of the chatter.
 * @param username string Username of the chatter.
 * @param message string Message that the chatter sent.
 * @param timestamp Date Date timestamp from when the message was sent.
 * @returns nothing.
 */
export async function logMessage(channel: string, id: number, username: string, message: string, timestamp: Date) {
  if (channel === 'pajlada') return;
  let ignoredBots: string[] = ['mahcksbot', 'streamelements', 'Supibot'];
  if (ignoredBots.includes(username)) return;
  await insertRow('INSERT INTO logs (channel, id, username, message, timestamp) VALUES (?, ?, ?, ?, ?);', [channel, id, username, message, timestamp]);
}

/**
 * Creates a shortned URL
 * @param {string} url
 * @returns {string | null} null if error
 */
export async function shortenURL(url: string) {
  try {
    let request = await axios({
      url: "https://l.mahcks.com/api/url/shorten",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "API-Key": config.apiKeys.lmahcks
      },
      data: {
        longUrl: url
      }
    });
    return await request.data["shortUrl"];
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Picks a random item from an array and returns it
 * 
 * @param array array to pick an item from.
 * @returns an item from the array.
 */
export const randomArray = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Gets a random chatter from the viewer list.
 * 
 * @param channel string Channel to get the chatters from.
 * @returns string Random chatter as a string.
 */
export const randomChatter = async (channel: string) => {
  (channel.startsWith("#")) ? channel = channel.substring(1) : channel;
  let chatters = await getAllChatters(channel);

  return randomArray(chatters);
};

export const getOptedOutUsers = async (command: string) => {
  let query = await findQuery('SELECT * FROM optout WHERE command=?;', [command]);
  let names: string[] = [];

  query.forEach((oo: any) => {
    names.push(oo.username);
  });

  return names
};

export const removeUsersOptedOut = async (chatters: any[], optedOut: any[]) => {
  return chatters = chatters.filter((el) => !optedOut.includes(el));
};

/**
 * Get the best avilable emote from a channel.
 * 
 * @param channel string Channel you want to check the emote in.
 * @param emotes string[] Array of emotes you'd like to choose from.
 * @param fallback string[] Array of preferably global emotes that you know every channel has.
 * @returns Either an emote from emotes, or if emotes is empty it chooses a fallback emote.
 */
export const getBestAvilableEmote = async (channel: string, emotes: string[], fallback: string[]) => {
  (channel.startsWith("#")) ? channel = channel.substring(1) : channel;

  let searchedEmotes: string[] = [];

  await Promise.all(emotes.map(async (emote) => {
    const search = await findQuery('SELECT * FROM emotes WHERE channel=? AND name=?;', [channel, emote]);
    if (search[0]) searchedEmotes.push(search[0].name);
  }));

  if (searchedEmotes.length === 0) return randomArray(fallback);
  return randomArray(searchedEmotes);
};

/**
 * 
 * @param min number Lowest number to start the range from
 * @param max number Highest number to end the range at.
 * @returns number a random number between the two numbers.
 */
export const pickNumberBetweenRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const logError = async (client: Actions, channel: string, username: string, type: "api" | "command" | "permission", message: string) => {
  (channel.startsWith("#")) ? channel.substring(1) : channel;
  await insertRow('INSERT INTO errors (channel, username, type, message, timestamp) VALUES (?, ?, ?, ?, ?);', [channel, username, type, message, new Date()]);
  sendMessage(channel, `FeelsDankMan 🚨 @${message}`);
}

export const handleSevenTVUpdate = async (client: Actions, event: EmoteEventUpdate) => {
  let settings = await getChannelSettings(event.channel);
  let eventType = event.action;

  if (settings.sevenTvUpdates) {
    if (eventType === "ADD") {
      client.action(event.channel, `[7tv] ${event.actor} added the emote ${event.name}`);
    } else if (eventType === "REMOVE") {
      client.action(event.channel, `[7tv] ${event.actor} removed the emote ${event.name}`);
    } else if (eventType === "UPDATE") {
      client.action(event.channel, `[7tv] ${event.actor} set the name from ${event.emote?.name} to ${event.name}`);
    }
  } else return;
}

/**
 * Post data to Hastebin
 * @param {string} message This will be posted to a Hastebin. 
 * @returns URL of Hastebin created.
 */
export async function postHastebin(message: string) {

  let response = await axios({
    method: "POST",
    url: "https://www.toptal.com/developers/hastebin/documents",
    data: message
  });

  let url = await shortenURL(`https://www.toptal.com/developers/hastebin/${response.data["key"]}`);
  return url;
}


export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Returns a Promise that resolves after "ms" Milliseconds
export const timer = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

// Does as the name suggests.
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Translates text to fun languages using api.funtranslations.com
 * @param text 
 */
export async function funTranslation(launguage: string, text: string) {
  const languagesSupported = ["morse", "jive", "cockney", "brooklyn", "ermahgerd", "pirate", "minion", "ferblatin", "chef", "dolan", "fudd", "sindarin", "quneya", "oldenglish", "shakespeare", "uk", "dothraki", "valyrian", "vulcan", "klingon", "piglatin", "yoda", "sith", "cheunh", "gungan", "mandalorian", "huttese"];

  if (!languagesSupported.includes(launguage)) return "That language is not supported.";

}

/**
 * Emote origin from Supinic API
 */

interface SupibotEmoteOriginEntry {
  ID: string;
  emoteID: string | null;
  type: string;
  author: string | null;
  reporter: string | null;
  text: string | null;
  notes: string | null;
}

//: Promise<SupibotEmoteOriginEntry[] | null>
export async function cacheEmoteOrigins(): Promise<SupibotEmoteOriginEntry[] | null> {
  const key = "list:supibot:origins";

  let expired = await redis.ttl(key);
  if (expired == -1 || await redis.exists(key) == 0) {
    const res = await axios.get("https://supinic.com/api/data/origin/list", {
      headers: {
        "User-Agent": "twitch.tv/mahcksimus"
      }
    });

    redis.set(key, JSON.stringify(res.data.data), 'ex', 43200) // 12 hours
    return res.data.data;
  } else {
    let data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }
}

export async function checkEmoteOrigin(emoteId: string | number): Promise<SupibotEmoteOriginEntry | null> {
  const originList = await cacheEmoteOrigins();

  if (originList) {
    return originList.find(entry => entry.emoteID === emoteId.toString()) ?? null;
  }

  return null;
}

// Prio 7tv -> BTTV -> FFZ
let bttvEmoteSearch = "https://api.betterttv.net/3/emotes/shared/search?query=[emoteCode]&limit=1";
let ffzEmoteSearch = "https://api.frankerfacez.com/v1/emotes?q=[emoteCode]&sort=count-desc";

export async function findSevenTVEmote(code: string) {
  const options: any = {
    method: 'POST',
    url: 'https://api.7tv.app/v2/gql',
    headers: { 'Content-Type': 'application/json' },
    data: {
      query: 'query($query: String!,$page: Int,$pageSize: Int,$globalState: String,$sortBy: String,$sortOrder: Int,$channel: String,$submitted_by: String,$filter: EmoteFilter) {search_emotes(query: $query,limit: $pageSize,page: $page,pageSize: $pageSize,globalState: $globalState,sortBy: $sortBy,sortOrder: $sortOrder,channel: $channel,submitted_by: $submitted_by,filter: $filter) {id,visibility,channel_count,owner {id,display_name,role {id,name,color},banned}name,tags}}',
      variables: { query: code, sortBy: 'popularity', limit: 1, sortOrder: 0 }
    }
  };

  let res = await axios.request(options);
  return res.data;
}

export async function findBTTVEmote(code: string) {
  const res = await axios.get(bttvEmoteSearch.replace("[emoteCode]", code));
  return res.data;
}

export async function findEmoteByPrio(code: string, platform: "any" | "bttv" | "ffz" | "7tv") {
  switch (platform) {
    case "7tv":
      return await findSevenTVEmote(code);
    case "bttv":
      return await findBTTVEmote(code);
  }
}

export function isNum(val: any) {
  return !isNaN(val)
}