import { Userstate } from "tmi.js";
import { findOne, findQuery, updateOne } from "./maria";

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

export async function checkAndUpdateBotRole(channel: string, userstate: Userstate) {
  let desiredRoles = ['moderator', 'vip'];

  let currentPerms = getUserPermissions(userstate);
  let search = await findQuery('SELECT role FROM channels WHERE username=?', [channel]);
  let foundRole = search[0].role;

  // this means he's a viewer 
  if (currentPerms.length === 0) {
    if (foundRole !== 'viewer') return await updateOne(`UPDATE channels SET role=? WHERE channel=?`, ['viewer', channel]);
  }
  console.log('current perms in chat', currentPerms);
  console.log('search', search[0].role);
}

export function getTarget(user: any, target: string) {
  let tagged = (target) ? target : user;
  tagged = (tagged?.startsWith("@")) ? tagged.substring(1) : tagged;
  return tagged;
}

export function removeFirstWord(str: string) {
  const indexOfSpace = str.indexOf(' ');

  if (indexOfSpace === -1) {
    return '';
  }

  return str.substring(indexOfSpace + 1);
}