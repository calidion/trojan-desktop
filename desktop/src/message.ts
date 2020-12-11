import { dialog, ipcMain } from "electron";
import { existsSync } from "fs";
import { runTrojan } from "./file";

export function initMessage() {
  ipcMain.on("file-open", async (event, file, configFile) => {
    if (existsSync(file) && existsSync(configFile)) {
      await runTrojan(file, configFile);
    }
  });
}
