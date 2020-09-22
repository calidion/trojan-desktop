import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";
import { runTrojan } from "./file";

export function initMessage() {
  ipcMain.on("file-open", async (event, file) => {
    console.log(event, file); // prints "ping"

    if (existsSync(file)) {
      await runTrojan(file);
    }
    // event.reply('asynchronous-reply', 'pong')
  });
}

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.returnValue = 'pong'
// })
