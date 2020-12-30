import { BrowserWindow, screen } from "electron";
import * as url from "url";

export class TrojanWindow {
  options: any;
  serve: boolean;
  win: BrowserWindow;
  constructor(options, serve: boolean) {
    this.options = options;
    this.serve = serve;
  }

  create() {
    if (!this.win) {
      const { options } = this;
      const allowRunningInsecureContent = this.serve;

      const size = screen.getPrimaryDisplay().workAreaSize;
      // Create the browser window.
      this.win = new BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
          nodeIntegration: true,
          allowRunningInsecureContent,
          enableRemoteModule: true
        },
        icon: options.icon.file,
      });
      this.win.on("closed", () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        this.win = null;
      });
      this.load();
    }
  }

  load() {
    this.win.loadURL(
      url.format({
        pathname: this.options.local.file,
        protocol: "file:",
        slashes: true,
      })
    );
  }
}
