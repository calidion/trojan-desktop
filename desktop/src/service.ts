import { exec, ExecException, ChildProcess } from 'child_process';

export interface ExecResult { error?: string, stderr?: string, stdout?: string, pid?: ChildProcess };

export class ShellService {
  name: string;
  constructor(name) {
    this.name = name;
  }

  public static exec(cmdStr: string, errorStr: string): Promise<ExecResult> {
    return new Promise((resolve, reject) => {
      const pid = exec(cmdStr, (error: ExecException, stdout: string, stderr: string) => {

        if (error) {
          console.error(errorStr, error);
          reject({ error, stderr });
          return;
        }
        if (stderr) {
          reject({ error, stderr });
          return;
        }
        resolve({ stdout, pid });
      });
    });
  }

  async run(action: string) {
    const cmdStr: string = "service " + this.name + " " + action;
    const errorStr: string = "Error " + action + " service!";
    return await ShellService.exec(cmdStr, errorStr);
  }

  async exists() {
    const cmdStr: string = "service " + this.name + ' status | grep "' + this.name + '.service"';
    const errorStr: string = "Error finding " + this.name + " service!";
    return await ShellService.exec(cmdStr, errorStr);
  }
  async status() {
    const cmdStr: string = "systemctl --no-pager status " + this.name;
    const errorStr: string = "Error status service!";
    return await ShellService.exec(cmdStr, errorStr);
  }
}