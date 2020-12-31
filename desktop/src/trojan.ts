import { ChildProcess, exec, ExecException } from 'child_process';
import { isPortTaken } from "./net";
import { readFile } from "fs";
import { promisify } from "util";
import { ShellService } from "./service";

const asyncReadFile = promisify(readFile);

export class Trojan {
  ls: ChildProcess = null;
  service: ShellService;
  constructor(serviceName: string) {
    this.service = new ShellService(serviceName);
  }

  public run(execFile: string, configFile: string, cb) {
    if (this.ls) {
      this.ls.kill();
    }
    const cmdStr = execFile + " -c " + configFile;
    const errorStr = "Error executing '" + cmdStr + "'";

    const pid = exec(cmdStr, (error: ExecException, stdout: string, stderr: string) => {
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
      cb(stdout)
    });
    if (!pid) {
      return true;
    }
    this.ls = pid;
    return true;
  }

  public async close(configFile: string) {
    const json: any = JSON.parse(String(await asyncReadFile(configFile)));
    if (await isPortTaken(json.local_port)) {
      console.error("port " + json.local_port + " is taken");
      try {
        let cmdStr = "lsof -i :" + json.local_port + " | grep " + this.service + " | awk '{if(NR==\"2\") print $2}'";
        let errorStr = "Error get port pid";
        let data: any = await ShellService.exec(cmdStr, errorStr);
        const pid = parseInt(data.stdout as string);
        if (pid) {
          cmdStr = "kill -9 " + pid;
          errorStr = "Error kill process:" + pid;
          data = await ShellService.exec(cmdStr, errorStr);
        } else {
          if (await isPortTaken(json.local_port)) {
            console.error("Port is taken by other user!");
            return false;
          }
        }

        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    return false;
  }

  public async stop() {
    await this.service.run("stop");
  }
}
