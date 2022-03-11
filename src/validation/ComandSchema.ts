const joi = require('@hapi/joi');
import { Actions, CommonUserstate, Userstate } from "tmi.js";
import { OPTIONAL_PERMISSIONS, VALID_PERMISSIONS } from "./PermissionTypes";

export interface CommandInt {
  Name: string;
  Aliases: string[];
  Permissions: ("developer" | "admin" | "moderator" | "trusted" | "broadcaster" | 'vip' | 'moderator')[];
  GlobalCooldown: number;
  Cooldown: number;
  Description: string;
  DynamicDescription: string[];
  Testing: boolean;
  OfflineOnly: boolean;
  OnlineOnly: boolean;
  Optout: boolean;
  Code: (client: Actions, channel: string, userstate: Userstate, context: any[]) => void;
}

/**
 * Validation for command files.
 * Change this when needed or when extending your system for more capabilities.
 */
export const CommandSchema = joi.object({
  Name: joi.string().min(1).max(32).required(),
  Aliases: joi.array().items(joi.string()),
  Permissions: joi.array().items(joi.string().valid(...VALID_PERMISSIONS, ...OPTIONAL_PERMISSIONS)),
  GlobalCooldown: joi.number(),
  Cooldown: joi.number(),
  Description: joi.string(),
  DynamicDescription: joi.array(),
  Testing: joi.boolean(),
  OfflineOnly: joi.boolean(),
  OnlineOnly: joi.boolean(),
  Optout: joi.boolean(),
  Code: joi.function().required()
});