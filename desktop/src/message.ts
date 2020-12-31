import { ipcMain } from "electron";
import { IpcMainEvent } from "electron/main";
import { existsSync } from "fs";
import { Trojan } from "./trojan";
// import { execFile } from 'child_process';

export class Messager {
  trojan: Trojan;
  constructor() {
    this.trojan = new Trojan("trojan");
  }

  checkFile(cmd, event, execFile, configFile) {
    if (!existsSync(execFile)) {
      const message = "Exec file: " + execFile + " not found!";
      event.reply(cmd, false, message);
      return false;
    }

    if (!existsSync(configFile)) {
      const message = "Config file: " + configFile + " not found!";
      event.reply(cmd, false, message);
      return false;
    }
    return true;
  }

  onTrojanRun(
    cmd: string,
    event: IpcMainEvent,
    execFile: string,
    configFile: string
  ) {

    if (this.checkFile(cmd, event, execFile, configFile)) {
      try {
        if (
          !this.trojan.run(
            execFile,
            configFile,
            (error: string, messsage: string) => {
              event.reply(cmd, error, messsage);
            }
          )
        ) {
          event.reply(cmd, true, "Fail to run trojan!");
        }
      } catch (e) {
        event.reply(cmd, true, e);
      }
    }
  }

  async onTrojanStop(
    cmd: string,
    event: IpcMainEvent,
    execFile: string,
    configFile: string
  ) {

    if (this.checkFile(cmd, event, execFile, configFile)) {
      try {
        if (await this.trojan.close(configFile)) {
          event.reply(cmd, false);
        } else {
          event.reply(cmd, true, "Unknown error!");
        }
      } catch (e) {
        event.reply(cmd, true, e);
      }
    }
  }

  init() {
    const runCmd = "trojan-run";
    const stopCmd = "trojan-stop";
    ipcMain.on(runCmd, async (event, execFile, configFile) => {
      this.onTrojanRun(runCmd, event, execFile, configFile);
    });

    ipcMain.on(stopCmd, async (event, execFile, configFile) => {
      await this.onTrojanStop(stopCmd, event, execFile, configFile);
    });

    ipcMain.on("service", async (event, action, execFile, configFile) => {
      let data;
      try {
        if (action === "status") {
          data = await this.trojan.service.status();
        } else {
          data = await this.trojan.service.run(action);
        }
        event.reply("service", false, data.stdout);
      } catch (e) {
        console.error(e);
        event.reply("service", true, e.message);

      }
    });
  }
}
