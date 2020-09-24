import { execFile } from "child_process";
import { dialog } from "electron";

let ls = null;

export async function runTrojan(file, configFile) {
  console.log("inside runTrojan")
  if (ls) {
    ls.kill();
    ls = null;
  }
  ls = execFile(file, [' -c ' + configFile], async (error, stdout, stderr) => {

    if (error) {

      console.error('stderr', stderr);

      throw error;

    }

    console.log('stdout', stdout);
    console.log('stderr', stderr);
    console.log('error', error);


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
