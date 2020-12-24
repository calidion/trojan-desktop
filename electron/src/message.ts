import { ipcMain } from 'electron';
import { IpcMainEvent } from 'electron/main';
import { existsSync } from 'fs';
import { Trojan } from './file';
// import { execFile } from 'child_process';

export class Messager {
  public trojan: Trojan;
  constructor() {
    this.trojan = new Trojan('trojan');
  }

  public checkFile(
    cmd: string,
    event: IpcMainEvent,
    execFile: string,
    configFile: string
  ) {
    if (!existsSync(execFile)) {
      const message = 'Exec file: ' + execFile + ' not found!';
      console.log(message);
      event.reply(cmd, false, message);
      return false;
    }

    if (!existsSync(configFile)) {
      const message = 'Config file: ' + configFile + ' not found!';
      console.log(message);
      event.reply(cmd, false, message);
      return false;
    }
    return true;
  }

  public onTrojanRun(
    cmd: string,
    event: IpcMainEvent,
    execFile: string,
    configFile: string
  ) {
    console.log('inside trojan run!');
    console.log(execFile, configFile);
    console.log('inside trojan run! 1');

    if (this.checkFile(cmd, event, execFile, configFile)) {
      try {
        console.log('inside trojan run! 2');
        if (
          this.trojan.run(
            execFile,
            configFile,
            (error: string, messsage: string) => {
              event.reply(cmd, error, messsage);
            }
          )
        ) {
          console.log('inside trojan run successfully');
          event.reply(cmd, false);
        } else {
          console.log('inside trojan run failed!');
          event.reply(cmd, true, 'Fail to run trojan!');
        }
      } catch (e) {
        console.log('inside trojan run exception:', e);
        event.reply(cmd, true, e);
      }
    }
    console.log('inside trojan run! 3');
  }

  public async onTrojanStop(
    cmd: string,
    event: IpcMainEvent,
    execFile: string,
    configFile: string
  ) {
    console.log('inside trojan stop! 1');

    if (this.checkFile(cmd, event, execFile, configFile)) {
      try {
        if (await this.trojan.close(configFile)) {
          console.log('inside trojan stop! 3');
          event.reply(cmd, false);
        } else {
          console.log('inside trojan stop! 4');
          event.reply(cmd, true, 'Unknown error!');
        }
      } catch (e) {
        event.reply(cmd, true, e);
      }
    }
    console.log('inside trojan stop! 5');
  }

  public init() {
    const runCmd = 'trojan-run';
    const stopCmd = 'trojan-stop';
    ipcMain.on(runCmd, async (event, execFile, configFile) => {
      this.onTrojanRun(runCmd, event, execFile, configFile);
    });

    ipcMain.on(stopCmd, async (event, execFile, configFile) => {
      await this.onTrojanStop(stopCmd, event, execFile, configFile);
    });

    ipcMain.on('service', async (event, action) => {
      let data: any;
      try {
        if (action === 'status') {
          data = await this.trojan.service.status();
        } else {
          data = await this.trojan.service.run(action);
        }
        console.log(data);
        event.reply('service', false, data);
      } catch (e) {
        event.reply('service', true, e);
      }
    });
  }
}
