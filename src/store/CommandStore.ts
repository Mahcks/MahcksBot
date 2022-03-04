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
      // TODO: for some reason this doesn't work but it does on RPB
      let isThere = await findQuery('SELECT * FROM commands WHERE name=?', [command.Name.toString()]);

      if (isThere) {
        let values = [command.Name, command.Aliases, command.Permissions, command.Description, command.DynamicDescription, command.GlobalCooldown, command.Cooldown, (command.Testing) ? "true" : "false", (command.OfflineOnly) ? "true" : "false", (command.OnlineOnly) ? "true" : "false", command.Name];
        await updateOne(`UPDATE commands SET name=?, aliases=?, permissions=?, description=?, dynamicDescription=?, globalCooldown=?, cooldown=?, testing=?, offlineOnly=?, onlineOnly=? WHERE name=?;`, values);
        //console.log('updated');
      } else {
        // TODO: Fix this
/*         let queryStr = `INSERT INTO commands (name, aliases, permissions, description, dynamicDescription, globalCooldown, cooldown, testing, offlineOnly, onlineOnly, count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        let values = [command.Name, JSON.stringify(command.Aliases), JSON.stringify(command.Permissions), command.Description, JSON.stringify(command.DynamicDescription), command.GlobalCooldown, command.Cooldown, (command.Testing) ? "true" : "false", (command.OfflineOnly) ? "true" : "false", (command.OnlineOnly) ? "true" : "false", 0];
        await insertRow(queryStr, values); */
      }
      //findOrCreate("commands", `Name='${command.name}'`, queryStr, values);
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