import { app } from "electron";

import { createWindow } from "./main/window";
import { initTray } from "./main/tray";

import { initMessage } from "./main/message";

import options from "./main/option";

const args = process.argv.slice(1),
  serve = args.some((val) => val === "--serve");

try {
  app.allowRendererProcessReuse = true;

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", () => {
    initTray(options.icon.file, app);
    initMessage();

    setTimeout(createWindow(options, serve, app), 400);
  });

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    createWindow(options, serve, app)();
  });
} catch (e) {
  // Catch Error
  // throw e;
}
