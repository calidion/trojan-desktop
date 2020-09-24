import { ChildProcess, execFile, execFileSync } from "child_process";
import { dialog } from "electron";

let ls: ChildProcess = null;

export class Trojan {
  static ls: ChildProcess;
  runnableFile = "";
  configFile = "";
  constructor(runnableFile, configFile) {
    this.runnableFile = runnableFile;
    this.configFile = configFile;
  }

  public run() {
    if (Trojan.ls) {
      Trojan.ls.kill();
    }
    try {
      Trojan.ls = execFile(this.runnableFile, ['-c', this.configFile], async (error, stdout, stderr) => {

        if (error) {

          console.error('stderr', stderr);

          throw error;

        }

        console.log('stdout', stdout);
        console.log('stderr', stderr);
        console.log('error', error);
        console.log('ls', ls);
      });
    } catch (e) {
      console.error('error', e);

    }
  }
}

export async function runTrojan(file, configFile) {
  console.log("inside runTrojan")
  if (ls) {
    ls.kill();
    ls = null;
  }
  ls = execFile(file, ['-c', configFile], async (error, stdout, stderr) => {

    if (error) {

      console.error('stderr', stderr);

      throw error;

    }

    console.log('stdout', stdout);
    console.log('stderr', stderr);
    console.log('error', error);
    console.log('ls', ls);


    // await dialog.showMessageBox(null, {
    //   message: "Process created!",
    // });

    // ls.stdout.on("data", async (data) => {
    //   await dialog.showMessageBox(null, {
    //     message: "stdout: " + data.toString(),
    //   });
    //   // process.send("stdout: " + data.toString());
    // });

    // ls.stderr.on("data", async (data) => {
    //   await dialog.showMessageBox(null, {
    //     message: "stderr: " + data.toString(),
    //   });
    //   // process.send("stderr: " + data.toString());

    // });

    // ls.on("exit", async (code) => {
    //   process.send("child process exited with code " + code.toString());
    //   console.log("child process exited with code " + code.toString());
    // });

    // process.on("message", async (data) => {
    //   await dialog.showMessageBox(null, {
    //     message: data.toString(),
    //   });
    // })

  });

}
