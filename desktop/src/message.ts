import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";
import { runTrojan } from "./file";

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
}
