import { EXEMPT } from "../validation/PermissionTypes";
import { CommonUserstate } from "tmi.js";
import config from "../config/config";

/**
 * Compares the supplied badges with the required badges.
 * @public
 * @param {Object} currentPermissionsObj  The badges object returned from the TMI
 * @param {Array} requiredPermissionsArr The permissions array from the specified command
 * @returns {Boolean} True if the supplied badges have at least one required badge, false if it doesn't have any required badge
 */
export default (currentUserstate: CommonUserstate, requiredPermissionsArr: Array<string>) => {

  // if the command doesn't require any badges/permissions, we can return true and run the command
  if (!requiredPermissionsArr || requiredPermissionsArr.length == 0) return true;

  // put all keys from the TMI 'badges' object into an array
  const currentPermsArr = currentUserstate["badges"] == null ? [] : Object.keys(currentUserstate["badges"]);

  // Check for if user is a developer, admin, or trusted
  if (requiredPermissionsArr.includes("developer")) {
    if (config.permissions.developers.includes(currentUserstate["username"])) currentPermsArr.push("developer");
  }
  if (requiredPermissionsArr.includes("admin")) {
    if (config.permissions.admins.includes(currentUserstate["username"])) currentPermsArr.push("admin");
  }
  if (requiredPermissionsArr.includes("trusted")) {
    if (config.permissions.trusted.includes(currentUserstate["username"])) currentPermsArr.push("trusted");
  }

  // if the user has any permission which is exempt from permission handling, we can return true and run the command
  if (EXEMPT.some(perm => currentPermsArr.includes(perm))) return true;

  // otherwise, check if the user has any permissions specified in the command, true : false
  return requiredPermissionsArr.some(perm => currentPermsArr.includes(perm));
}