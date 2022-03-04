import { findQuery } from "./maria";

export interface ChannelSettings {
  id: number;
  username: string;
  prefix: string;
  role: string;
}

export interface Permissions {
  id: number;
  username: string;
  role: string;
}

export let permissions: Permissions[] = [];
export let channelSettings: ChannelSettings[] = [];

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

export async function updatePrefix(id: number, newPrefix: string) {
  let index = channelSettings.map(e => e.id).indexOf(id);
  channelSettings[index].prefix = newPrefix;
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