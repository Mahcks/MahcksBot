/** 
 * The permissions system is based on the "badges" object returned by the TMI
 * For more info: https://dev.twitch.tv/docs/irc/tags#globaluserstate-twitch-tags
 */
 const OPTIONAL_PERMISSIONS: Array<string> = ["developer", "admin", "trusted"];
 const VALID_PERMISSIONS: Array<string> = ['broadcaster', 'moderator', 'subscriber', 'vip', 'turbo', 'bits'];
 const EXEMPT: Array<string> = ['broadcaster'];
 
 export { OPTIONAL_PERMISSIONS, VALID_PERMISSIONS, EXEMPT };