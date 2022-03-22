import { redis } from "../../main";
import { findQuery } from "../../utils/maria"

interface BanPhrase {
  type: string;
  name: string;
  phrase: RegExp;
}

export const updateBanphrases = async () => {
  let total = await findQuery('SELECT * FROM banphrases;', []);
  let phrases: BanPhrase[] = [];

  total.forEach((bp: BanPhrase) => {
    phrases.push(bp);
  });

  redis.set('bot:banphrase:list', JSON.stringify(phrases));
}

export async function getLocalBanphrases(): Promise<BanPhrase[]> {
  let listData = await redis.get('bot:banphrase:list');
  if (!listData) return [];

  return JSON.parse(listData);
}