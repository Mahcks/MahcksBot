import axios, { AxiosError } from "axios";
import { isNum } from ".";
import config from "../config/config";

const headers = {
  "Client-ID": config.helixOptions.clientId,
  "Authorization": "Bearer " + config.helixOptions.token
};

async function fetchHelixAPI(endpoint: string, query: object | string) {
  let URL = `https://api.twitch.tv/helix/${endpoint}?${query}`;
  let userInfo = await axios({ method: "get", url: URL, headers: headers });
  return userInfo.data;
}

export async function getUser(user: string | number) {
  return await fetchHelixAPI("users", Number(user) ? `id=${user}` : `login=${user}`);
}

/**
 * Get's information from api.ivr.fi
 * 
 * @param user string
 */
export async function resolveUser(user: string) {
  let isNumber = isNum(Number(user)); // true if string
  let link = "https://api.ivr.fi/v2/twitch/user?";
  let endpoint = (isNumber) ? `id=${user}` : `login=${user}`;
  try {
    const res = await axios.get(link + endpoint);
    return res.data;
  } catch (error: any) {
    return error.response.data.error;
  }
}

export async function getUserId(username: string) {
  let id = await getUser(username);
  if (id['data'].length === 0) return false;
  return id["data"][0]["id"];
}

export async function getTags(channel: string) {
  channel = (channel.startsWith("#")) ? channel.substring(1) : channel;

  let uid = await getUserId(channel);

  let req = await axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/streams/tags?broadcaster_id="+uid,
    headers: headers
  });

  let tagData = req.data.data;
    let currentTags: string[] = [];
    tagData.forEach((tag: any) => {
      let names = tag.localization_names;
      currentTags.push(names["en-us"]);
    });

  return currentTags;
}

export async function getThumbnail(channel: string) {
  channel = (channel.startsWith("#")) ? channel.substring(1) : channel;
  return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel.toLowerCase()}-1920x1080.jpg`;
}

export async function getStreamInfo(id: number) {
  let req = await axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/streams?user_id="+id,
    headers: headers
  });

  return req.data.data;
}

export async function getUsersFollowers(username: string) {
  let id = await getUserId(username);

  let response = await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${id}&first=100`, {
    method: "GET",
    headers: headers
  });

  let data = await response.data;
  let total = [];
  for (let i = 0; i < data.data.length; i++) {
    let streamers = { streamer: data.data[i]["to_name"], date: data.data[i]["followed_at"] };
    total.push(streamers);
  }

  let totalPages = Math.ceil(data.total / 100);
  let cursor = data.pagination.cursor;
  let pages = [];
  for (let i = 1; i < totalPages; i++) {
    let response2 = await axios.get(`https://api.twitch.tv/helix/users/follows?from_id=${id}&first=100&after=${cursor}`, {
      method: "GET",
      headers: headers
    });

    let datatwo = await response2.data;
    cursor = datatwo.pagination.cursor;
    pages.push(datatwo.data);
  }

  for (let i = 0; i < pages.length; i++) {
    for (let j = 0; j < pages[i].length; j++) {
      total.push({ streamer: pages[i][j]["to_name"], date: pages[i][j]["followed_at"] });
    }
  }
  return total;
}