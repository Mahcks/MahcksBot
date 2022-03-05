import { findQuery } from "./maria";

export interface ChannelSettings {
  id: number; // ID of the broadcaster.
  username: string; // Username of the broadcaster.
  prefix: string; // Sets their own prefix.
  logged: boolean; // Does the broadcaster want their channel logged for WST?
  disabledCommands: string[]; // List of commands that are disabled for that streamer.
}

export interface Permissions {
  id: number;
  username: string;
  role: string;
}

export let permissions: Permissions[] = [];
export let channelSettings: (ChannelSettings|any)[] = [];

// Get all prefixes from database
export async function initChannelSettings() {
  let cSettings = await findQuery('SELECT * FROM channels;', []);
  let data = cSettings;

  data.forEach((channel: ChannelSettings) => {
    channelSettings.push(channel);
  });

  let perms = await findQuery('SELECT * FROM permissions;', []);
  perms.forEach((perm: Permissions) => {
    permissions.push(perm);
  });
}

export async function addChannelSetting(settings: ChannelSettings) {
  channelSettings.push(settings);
}

export async function removeChannelSetting(id: number) {
  channelSettings = channelSettings.filter(function (obj: ChannelSettings) {
    return obj.id !== id;
  });
}

/* 

  id: number; // ID of the broadcaster.
  username: string; // Username of the broadcaster.
  prefix: string; // Sets their own prefix.
  logged: boolean; // Does the broadcaster want their channel logged for WST?
  disabledCommands: string[]; // List of commands that are disabled for that streamer.

*/

export async function updatePrefix(id: number, type: 'id' | 'username' | 'prefix' | 'logged' | 'disabledCommands', value: string) {
  let index = channelSettings.map(e => e.id).indexOf(id);
  channelSettings[index][type] = value;
}

export function getChannelSettings(channel: string) {
  if (channel.startsWith("#")) channel = channel.substring(1);
  let index = channelSettings.map(e => e.username).indexOf(channel);
  return channelSettings[index];
}

// Get permissions from database.
export function getUsersPermissions(id: number) {
  let index = permissions.map(e => e.id).indexOf(id);
  return permissions[index];
}