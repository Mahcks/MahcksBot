import { redis } from "../main";
import { findQuery } from "./maria";

export interface ChannelSettings {
  id: number; // ID of the broadcaster.
  username: string; // Username of the broadcaster.
  prefix: string; // Sets their own prefix.
  role: string;
  logged: boolean | string; // Does the broadcaster want their channel logged for WST?
  disabledCommands: string | string[]; // List of commands that are disabled for that streamer.
}

export interface Permissions {
  id: number;
  username: string;
  role: string;
}

export let permissions: Permissions[] = [];

// Get all prefixes from database
export async function initChannelSettings() {
  let cSettings = await findQuery('SELECT * FROM channels;', []);

  cSettings.forEach((channel: ChannelSettings) => {
    let toPush: ChannelSettings = {
      id: channel.id,
      username: channel.username,
      prefix: channel.prefix,
      role: channel.role,
      disabledCommands: JSON.parse(channel.disabledCommands as string),
      logged: Boolean(channel.logged)
    };

    redis.set(channel.username, JSON.stringify(toPush));
  });

  let perms = await findQuery('SELECT * FROM permissions;', []);
  perms.forEach((perm: Permissions) => {
    permissions.push(perm);
  });
}

export async function addChannelSetting(settings: ChannelSettings) {
  redis.set(settings.username, JSON.stringify(settings))
}

export async function removeChannelSetting(channel: string) {
  (channel.startsWith("#")) ? channel = channel.substring(1) : channel;
  redis.del(channel);
}

/* 
  id: number; // ID of the broadcaster.
  username: string; // Username of the broadcaster.
  prefix: string; // Sets their own prefix.
  logged: boolean; // Does the broadcaster want their channel logged for WST?
  disabledCommands: string[]; // List of commands that are disabled for that streamer.
*/
export async function updateChannelCache(channel: string, type: 'id' | 'username' | 'role' | 'prefix' | 'logged' | 'disabledCommands', value: string | string[]) {
  (channel.startsWith("#")) ? channel = channel.substring(1) : channel;

  let curr = await getChannelSettings(channel);
  curr[type] = value;

  redis.del(channel);
  redis.set(channel, JSON.stringify(curr));
}

export async function getChannelSettings(channel: string) {
  (channel.startsWith("#")) ? channel = channel.substring(1) : channel;

  const toReturn = await redis.get(channel);
  if (!toReturn) return null;

  return JSON.parse(toReturn);
}

// Get permissions from database.
export function getUsersPermissions(id: number) {
  let index = permissions.map(e => e.id).indexOf(id);
  return permissions[index];
}

export function safeCloseBot() {
  ["SIGINT", 'SIGTERM', 'SIGQUIT']
    .forEach(signal => process.on(signal, () => {
      console.log("GJSAKGHJSAGHJ")
    }));
}