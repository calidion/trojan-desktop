import { ipcMain } from "electron";
import { IpcMainEvent } from "electron/main";
import { existsSync } from "fs";
import { Trojan } from "./file";
// import { execFile } from 'child_process';

export class Messager {
  trojan: Trojan;
  constructor() {
    this.trojan = new Trojan("trojan");
  }

  checkFile(cmd, event, execFile, configFile) {
    if (!existsSync(execFile)) {
      const message = "Exec file: " + execFile + " not found!";
      console.log(message);
      event.reply(cmd, false, message);
      return false;
    }

    if (!existsSync(configFile)) {
      const message = "Config file: " + configFile + " not found!";
      console.log(message);
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
    console.log("inside trojan run!");
    console.log(execFile, configFile);
    console.log("inside trojan run! 1");

    if (this.checkFile(cmd, event, execFile, configFile)) {
      try {
        console.log("inside trojan run! 2");
        if (
          !this.trojan.run(
            execFile,
            configFile,
            (error: string, messsage: string) => {
              console.log("inside callback !");
              console.log(error, messsage);
              event.reply(cmd, error, messsage);
            }
          )
        ) {
          console.log("inside trojan run failed!");
          event.reply(cmd, true, "Fail to run trojan!");
        }
      } catch (e) {
        console.log("inside trojan run exception:", e);
        event.reply(cmd, true, e);
      }
    }
    console.log("inside trojan run! 3");
  }

  async onTrojanStop(
    cmd: string,
    event: IpcMainEvent,
    execFile: string,
    configFile: string
  ) {
    console.log("inside trojan stop! 1");

    if (this.checkFile(cmd, event, execFile, configFile)) {
      try {
        if (await this.trojan.close(configFile)) {
          console.log("inside trojan stop! 3");
          event.reply(cmd, false);
        } else {
          console.log("inside trojan stop! 4");
          event.reply(cmd, true, "Unknown error!");
        }
      } catch (e) {
        event.reply(cmd, true, e);
      }
    }
    console.log("inside trojan stop! 5");
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
        console.log(data);
        event.reply("service", false, data);
      } catch (e) {
        event.reply("service", true, e);
      }
    });
  }
}
