import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";
import { runTrojan } from "./file";

export function initMessage() {
  ipcMain.on("file-open", async (event, file, configFile) => {
    console.log(event, file); // prints "ping"

    console.log("file = " , file);
    console.log("config file = " , configFile);
    if (existsSync(file) && existsSync(configFile)) {

      console.log("exist file: " , file);

      await runTrojan(file, configFile);
    }
    // event.reply('asynchronous-reply', 'pong')
  });
}

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })
