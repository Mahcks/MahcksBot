import axios from "axios";
import moment from "moment";
import { Actions, client, Userstate } from "tmi.js";
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
  let req = await axios.get('https://api.ivr.fi/twitch/modsvips/'+channel);
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

export async function getAllChatters(channel: string) {
  let chatters: string[] = [];

  let chatData = await fetchAPI(`https://tmi.twitch.tv/group/user/${channel}/chatters`);
  let cd = chatData["chatters"];
  chatters.push(...cd["broadcaster"], ...cd["moderators"], ...cd["staff"], ...cd["admins"], ...cd["global_mods"], ...cd["viewers"]);
  return chatters;
}

export async function logMessage(channel: string, id: number, username: string, message: string, timestamp: Date) {
  await insertRow('INSERT INTO logs (channel, id, username, message, timestamp) VALUES (?, ?, ?, ?, ?);', [channel, id, username, message, timestamp]);
}