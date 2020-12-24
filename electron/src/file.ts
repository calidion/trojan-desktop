import { ChildProcess, exec, ExecException } from 'child_process';
import { readFile } from 'fs';
import { promisify } from 'util';
import { isPortTaken } from './net';
import { ShellService } from './service';

const asyncReadFile = promisify(readFile);

export class Trojan {
  public ls?: ChildProcess;
  public service: ShellService;
  constructor(serviceName: string) {
    this.service = new ShellService(serviceName);
  }

  public run(execFile: string, configFile: string, cb?: (error: boolean | null, message: string | ExecException | null) => void | null) {
    if (this.ls) {
      this.ls.kill();
    }
    const cmdStr = execFile + ' -c ' + configFile;
    const errorStr = "Error executing '" + cmdStr + "'";

    const pid = exec(
      cmdStr,
      (error: ExecException | null, stdout: string, stderr: string): void => {
        if (!cb) {
          cb = () => { };
        }
        if (error) {
          console.error(errorStr, error);
          cb(true, error);
          return;
        }
        if (stderr) {
          console.error(errorStr, stderr);
          cb(true, stderr);
          return;
        }
        console.log(stdout);
        cb(false, stdout);
      }
    );
    if (!pid) {
      return true;
    }
    this.ls = pid;
    return true;
  }

  public async close(configFile: string) {
    const json: any = JSON.parse(String(await asyncReadFile(configFile)));
    if (await isPortTaken(json.local_port)) {
      console.error('port ' + json.local_port + ' is taken');
      try {
        let cmdStr =
          'lsof -i :' + json.local_port + ' | awk \'{if(NR=="2") print $2}\'';
        let errorStr = 'Error get port pid';
        let data: any = await ShellService.exec(cmdStr, errorStr);
        const pid = parseInt(data.stdout as string, 10);
        cmdStr = 'kill -9 ' + pid;
        errorStr = 'Error kill process:' + pid;
        data = await ShellService.exec(cmdStr, errorStr);
        console.log('data: ', data);
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    return false;
  }

  public async stop() {
    await this.service.run('stop');
  }
}
