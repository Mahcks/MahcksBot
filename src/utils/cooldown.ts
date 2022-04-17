import { CommonUserstate } from "tmi.js";
import config from "../config/config";

// Temp data since it's not to important to store in JSON or DB
const cooldowns = new Map();
const globalCD = new Map();

export async function addCooldown(user: string, commandName: string, cdTime: number) {
  let res = null;

  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Map());
  }

  const currentTime = Date.now();
  const timeStamps = cooldowns.get(commandName);
  const cooldownAmount = (cdTime) * 1000;

  if (timeStamps.has(user)) {
    const expireTime = timeStamps.get(user) + cooldownAmount;

    if (currentTime < expireTime) {
      const timeLeft = (expireTime - currentTime) / 1000;

      res = false;
    }
  }

  timeStamps.set(user, currentTime);
  setTimeout(() => timeStamps.delete(user), cooldownAmount);
  return res;
}

export async function globalCooldown(commandName: string, cdTime: number) {
  let res = true;
  const currentTime = Date.now();
  const cooldownAmount = (cdTime) * 1000;

  if (!globalCD.has(commandName)) {
    globalCD.set(commandName, cooldownAmount);
  }

  if (globalCD.has(commandName)) {
    const expireTime = globalCD.get(commandName) + cooldownAmount;

    if (currentTime < expireTime) {
      const timeLeft = (expireTime - currentTime) / 1000;

      res = false;
    }
  }

  globalCD.set(commandName, currentTime);
  setTimeout(() => globalCD.delete(commandName), cooldownAmount);
  return res;
}

import isUserPermitted from "./isUserPremitted";
export async function cooldownCanContinue(user: CommonUserstate, cmdName: string, cmdCooldown: number, globalCD: number) {
  let canRun = true;

  // If they are a broadcaster/mod/trusted they don't get a cooldown
  if (isUserPermitted(user, ["broadcaster", "moderator"]) || config["permissions"]['trusted'].includes(user["username"])) return true;
  
  let isOnGlobalCD = await globalCooldown(cmdName, globalCD);
  // Check if the global cooldown is enabled.
  if (isOnGlobalCD === false) {
    // if it is mark the command as can't be ran.
    canRun = false;
  } else {
    // Try to see if the user has a personal cooldown for the command.
    let isOnCD = await addCooldown(user["username"], cmdName, cmdCooldown);
    if (isOnCD === false) canRun = false;
  }

  return canRun;
}