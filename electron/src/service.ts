import { exec, ExecException } from 'child_process';
export class ShellService {

  public static exec(cmdStr: string, errorStr: string) {
    return new Promise((resolve, reject) => {
      const pid = exec(
        cmdStr,
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error) {
            console.error(errorStr, error);
            reject(error);
            return;
          }
          if (stderr) {
            reject(stderr);
            return;
          }
          resolve({ stdout, pid });
        }
      );
    });
  }
  public name: string;
  constructor(name: string) {
    this.name = name;
  }

  public async run(action: string) {
    const cmdStr: string = 'service ' + this.name + ' ' + action;
    const errorStr: string = 'Error ' + action + ' service!';
    return ShellService.exec(cmdStr, errorStr);
  }

  public async exists() {
    const cmdStr: string =
      'service ' + this.name + ' status | grep "' + this.name + '.service"';
    const errorStr: string = 'Error finding ' + this.name + ' service!';
    return ShellService.exec(cmdStr, errorStr);
  }
  public async status() {
    const cmdStr: string = 'systemctl --no-pager status ' + this.name;
    const errorStr: string = 'Error status service!';
    return ShellService.exec(cmdStr, errorStr);
  }
}
