// TODO: come up with a name like "cookies" or "egs"

import { findQuery, sqlQuery } from "../../utils/maria";

export async function getPoints(id: number): Promise<number> {
  let query = await findQuery('SELECT points FROM chatters WHERE id=?;', [id]);
  return query[0].points;
}

export async function addPoints(id: number, amount: number) {
  let curr = await getPoints(id);
  let newAmount = curr + amount;
  
  await sqlQuery('UPDATE chatters SET points = ? WHERE id = ?;', [newAmount, id]);
}

async function removePoints(id: number, amount: number) {

}

async function setPoints(id: number, amount: number) {

}