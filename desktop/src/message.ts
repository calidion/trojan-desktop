import { ipcMain } from "electron";
import { existsSync } from "fs";
import { config } from "rxjs";
import { Trojan } from './file';


export class Messager {
  trojan: Trojan;
  constructor() {
    this.trojan = new Trojan("trojan");
  }

  init() {
    const runCmd = "trojan-run";
    ipcMain.on(runCmd, async (event, file, configFile) => {
      console.log("inside trojan run!");
      console.log(file, configFile);
      if (!existsSync(file)) {
        const message = "Exec file: " + file + " not found!";
        console.log(message);
        event.reply(runCmd, false, message);
        return;
      }

      if (!existsSync(configFile)) {
        const message = "Config file: " + configFile + " not found!";
        console.log(message);
        event.reply(runCmd, false, message);
        return;
      }

      console.log("inside trojan run! 1");


      try {
        console.log("inside trojan run! 2");
        if (this.trojan.run(file, configFile, (error, messsage) => {
          event.reply(runCmd, error, messsage)
        })) {
          console.log("inside trojan run successfully");
          event.reply(runCmd, false);
        } else {
          console.log("inside trojan run failed!");
          event.reply(runCmd, true, "Fail to run trojan!");
        }
      } catch (e) {
        console.log("inside trojan run exception:", e);
        event.reply(runCmd, true, e);
      }
      console.log("inside trojan run! 3");
    });

    ipcMain.on("trojan-stop", async (event, execFile, configFile) => {
      console.log("inside trojan stop! 1");

      if (!existsSync(execFile)) {
        event.reply("trojan-stop", true, "Missing exec file!");
      }

      if (!existsSync(configFile)) {
        event.reply("trojan-stop", true, "Missing config file!");
      }

      console.log("inside trojan stop! 2");
      try {

        if (await this.trojan.close(configFile)) {
          console.log("inside trojan stop! 3");
          event.reply("trojan-stop", false);
        } else {
          console.log("inside trojan stop! 4");

          event.reply("trojan-stop", true, "Unknown error!");
        }

      } catch (e) {
        event.reply("trojan-stop", true, e);

      }
      console.log("inside trojan stop! 5");

    });

    ipcMain.on("service", async (event, action) => {
      try {
        const data = await this.trojan.service.run(action);
        event.reply("service", true, data);
      } catch (e) {
        event.reply("service", false, e);
      }
    });
  }
}
