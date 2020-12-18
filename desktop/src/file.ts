import { ChildProcess, execFile, execFileSync, exec } from "child_process";
import { isPortTaken } from "./net";
import { readFile } from "fs";
import { promisify } from "util";

const asyncReadFile = promisify(readFile);

// let ls: ChildProcess = null;

export class Trojan {
  static ls: ChildProcess = null;
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
      Trojan.ls = execFile(
        this.runnableFile,
        ["-c", this.configFile],
        async (error, stdout, stderr) => {
          if (error) {
            console.error("stderr", stderr);

            throw error;
          }
        }
      );
    } catch (e) {
      console.error("error", e);
    }
  }
}

export async function closeTrojan(file, configFile) {
  const json: any = JSON.parse(String(await asyncReadFile(configFile)));
  if (await isPortTaken(json.local_port)) {
    console.error("port " + json.local_port + " is taken");
    return await new Promise((resolve, reject) => {
      exec(
        "lsof -i :" + json.local_port + " | awk '{if(NR==\"2\") print $2}'",
        (error, stdout, stderr) => {
          if (error) {
            console.error("Error get port pid", error);
            reject(error);
            return;
          }

          const pid = parseInt(stdout);

          exec("kill -9 " + pid, (error1, stdout1, stderr1) => {
            if (error1) {
              console.error("Error kill process:" + pid, error1);
              reject(error1);
              return;
            }
            resolve(true);
          });
        }
      );
    });
  }
  return false;
}

export async function runTrojan(file, configFile) {
  console.log(file, configFile);
  const json: any = JSON.parse(String(await asyncReadFile(configFile)));
  console.log(json);

  if (await isPortTaken(json.local_port)) {
    console.error("port " + json.local_port + " is taken");
    return false;
  }

  if (Trojan.ls) {
    Trojan.ls.kill();
    Trojan.ls = null;
  }

  Trojan.ls = execFile(
    file,
    ["-c", configFile],
    async (error, stdout, stderr) => {
      if (error) {
        console.error("stderr", stderr);

        throw error;
      }

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
    }
  );
  return true;
}
