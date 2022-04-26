import { sqlQuery } from "./maria"

export default {
  get: async function(id: number): Promise<number> {
    const currBalance = await sqlQuery('SELECT points FROM chatters WHERE id=?;', [id]);
    console.log(currBalance);
    return currBalance[0].points;

    return -1
  },
  add: async function(id: number, amount: number) {

  },
  remove: async function(id: number, amount: number) {

  },
  set: async function(id: number, amount: number) {

  }
}