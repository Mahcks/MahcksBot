import axios from "axios";
import moment from "moment";
import { Actions, client, Userstate } from "tmi.js";
import config from "../config/config";
import { pool } from "../main";
import { findQuery, insertRow, updateOne } from "./maria";

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

  if (!exclude.includes('s'))
    if (seconds > 0) dateArr.push(seconds + "s");

  return dateArr.join(", ")
}

export async function checkMessageBanPhrase(message: string) {
  let data: any;
  try {
    data = await axios({
      method: 'POST',
      url: `https://cyrbot.com/api/v1/banphrases/test/`,
      headers: { 'Content-Type': 'application/json' },
      data: { message: message }
    });
  } catch (error) {
    data = null;
  }

  return await data;
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
  let req = await axios.get('https://api.ivr.fi/twitch/modsvips/' + channel);
  let mods = [...req.data.mods, ...req.data.vips];

  let index = mods.map((e: any) => e.login).indexOf(user.username);
  let isMod = (typeof mods[index] === 'undefined') ? false : true;

  /* const isBroadcaster = channel === user.username;
  const isModUp = isMod || isBroadcaster; */
  return isMod;
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

export async function fetchAPI(url: string) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.warn(error)
    return error;
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
  let cd = chatData["chatters"];
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
        "API-Key": config.lmahcks
      },
      data: {
        longUrl: url
      }
    });
    return await request.data["shortUrl"];
  } catch (error) {
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

export const pickNumberBetweenRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}