import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";
import { runTrojan, closeTrojan } from "./file";

export function initMessage() {
  ipcMain.on("file-open", async (event, file, configFile) => {
    if (existsSync(file) && existsSync(configFile)) {
      if (await runTrojan(file, configFile)) {
        event.reply("run", true);
      } else {
        event.reply("run", false);
      }
    }
  });

  ipcMain.on("file-close", async (event, file, configFile) => {
    if (existsSync(file) && existsSync(configFile)) {
      if (await closeTrojan(file, configFile)) {
        event.reply("close", true);
      } else {
        event.reply("close", false);
      }
    }
  });
}
