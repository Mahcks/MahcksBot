import { findOne, findQuery, insertRow, updateOne } from "../utils/maria";
import { readdirSync, statSync } from "fs";
import { CommandInt, CommandSchema } from "../validation/ComandSchema";
import { pool } from "../main";

export class CommandStore {
  _directory: string;
  _commands: Array<CommandInt> = [];

  constructor(directory: string) {
    this._directory = directory;
    this._loadAllCommands();
  }

  _storeAllCommands(commands: Array<CommandInt>) {
    commands.forEach(async (command) => {
      let isThere = await findQuery('SELECT * FROM commands WHERE name=?', [command.Name.toString()]);

      if (isThere[0]) {
        let qString = `UPDATE commands SET name=?, aliases=?, permissions=?, description=?, dynamicDescription=?, globalCooldown=?, cooldown=?, testing=?, offlineOnly=?, onlineOnly=?, optout=? WHERE name=?;`;
        let values = [
          command.Name,
          JSON.stringify(command.Aliases),
          JSON.stringify(command.Permissions),
          command.Description,
          JSON.stringify(command.DynamicDescription),
          command.GlobalCooldown,
          command.Cooldown,
          (command.Testing) ? 1 : 0,
          (command.OfflineOnly) ? 1 : 0,
          (command.OnlineOnly) ? 1 : 0,
          (command.Optout) ? 1 : 0,
          command.Name
        ];
        await updateOne(qString, values);
      } else {
        let queryStr = `INSERT INTO commands (name, aliases, permissions, description, dynamicDescription, globalCooldown, cooldown, testing, offlineOnly, onlineOnly, optout, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        let values = [
          command.Name,
          JSON.stringify(command.Aliases),
          JSON.stringify(command.Permissions),
          command.Description,
          JSON.stringify(command.DynamicDescription),
          command.GlobalCooldown, command.Cooldown,
          (command.Testing) ? 1 : 0,
          (command.OfflineOnly) ? 1 : 0,
          (command.OnlineOnly) ? 1 : 0,
          (command.Optout) ? 1 : 0,
          0
        ];
        await insertRow(queryStr, values);
      }
    })
  }

  _loadAllCommands() {
    const files = _getAllFilesFromFolder(this._directory);
    files.forEach(file => {
      let checkNonCommands = file.split("/");
      let nonCmds = checkNonCommands[checkNonCommands.length - 1];
      if (nonCmds === "index.js") {
        try {
          const command: CommandInt = require(`${file}`);
          const validated = CommandSchema.validate(command);
          let cmdDirString = file.substring(0, file.lastIndexOf("/") + 1);
          let cmdArr = cmdDirString.split("/");

          let cmdName: string = cmdArr[4];
          if (validated.error == null) {
            console.log(`Command ${cmdName} has been loaded.`);
            this._commands.push(command)
          } else {
            console.warn(`Command ${cmdName} could not be loaded. Validation: ${validated.error}`);
          }
        } catch (error) {
          console.warn(`A command could not be loaded. ${error}`);
        }
      }
    });
    this._storeAllCommands(this._commands);
  }

  getCommand(commandName: (string | undefined)) {
    if (!commandName) return;
    let found = this._commands.find(cmd => cmd.Name === commandName) || this._commands.find(cmd => cmd.Aliases.includes(commandName));
    if (!found) return null;
    return found;
  }

}

let _getAllFilesFromFolder = function (dir: string) {
  let results: string[] = [];
  readdirSync(dir).forEach(function (file) {
    file = dir + '/' + file;
    let stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(_getAllFilesFromFolder(file))
    } else results.push(file);
  });

  return results;
};