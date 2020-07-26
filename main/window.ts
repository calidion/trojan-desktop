import { BrowserWindow, screen, dialog } from "electron";
import * as url from "url";

let win: BrowserWindow = null;

function createWindowInner(options, serve, app): BrowserWindow {
  const { icon, local } = options;
  // console.log(icon);
  // if (!icon.file) {
  //   dialog.showMessageBox(null, {
  //     message: "File Not Found!",
  //   });
  // } else {
  //   dialog.showMessageBox(null, {
  //     message: "File Found!",
  //   });
  // }

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;


  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
    },
    icon: icon.file,
  });

  if (serve) {
    win.webContents.openDevTools();

    require("electron-reload")(__dirname, {
      electron: options.electron.module,
    });
    win.loadURL(local.host);
  } else {
    win.loadURL(
      url.format({
        pathname: options.local.file,
        protocol: "file:",
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

export function createWindow(options, serve, app) {
  return () => {
    if (win) {
      return win;
    }
    return createWindowInner(options, serve, app);
  };
}
