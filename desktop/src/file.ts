import { execFile } from "child_process";
import { dialog } from "electron";

let ls = null;

export async function runTrojan(file) {
  if (ls) {
    ls.kill();
    ls = null;
  }
  ls = execFile(file, ["--help"]);

  await dialog.showMessageBox(null, {
    message: "Process created!",
  });

  ls.stdout.on("data", async (data) => {
    await dialog.showMessageBox(null, {
      message: "stdout: " + data.toString(),
    });
    // process.send("stdout: " + data.toString());
  });

  ls.stderr.on("data", async (data) => {
    await dialog.showMessageBox(null, {
      message: "stderr: " + data.toString(),
    });
    // process.send("stderr: " + data.toString());

  });

  ls.on("exit", async (code) => {
    process.send("child process exited with code " + code.toString());
    console.log("child process exited with code " + code.toString());
  });

  process.on("message", async (data) => {
    await dialog.showMessageBox(null, {
      message: data.toString(),
    });
  })
}
