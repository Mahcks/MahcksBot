import axios, { AxiosError } from "axios";
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
  try {
    const res = await axios.get(`https://api.ivr.fi/twitch/resolve/${user}`);
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