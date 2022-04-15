import { sqlQuery } from "./maria"

export async function billycoinsGet(id: number): Promise<number> {
  const currBalance = await sqlQuery('SELECT points FROM chatters WHERE id=?;', [id]);
  console.log(currBalance);
  return currBalance[0].points;

  return -1
}

export async function billycoinsAdd(id: number, amount: number) {
  
}

export async function billycoinsRemove(id: number, amount: number) {

}