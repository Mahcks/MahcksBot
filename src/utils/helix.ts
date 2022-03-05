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
  return id["data"][0]["id"];
}