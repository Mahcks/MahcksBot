import { redis } from "../../main";

export default async (channel: string, role: string): Promise<boolean> => {
  const rkey = `chat:rate:limits:${channel}`;

  let chLimit = await redis.get(rkey);

  // If key exists, increase the number otherwise create it.
  (chLimit) ? redis.incr(rkey) : redis.set(rkey, 1, 'ex', 30);

  let newRate = await redis.get(rkey);
  if (role === "moderator") {
    return (parseInt(newRate!) >= 100) ? false : true;
  } else return (parseInt(newRate!) >= 20) ? false : true;
}