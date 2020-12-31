import { app, Menu } from "electron";
import { initTray } from './tray';
import { Messager } from './message';
import { TrojanWindow } from './window';


export class TrojanClientApplication {
  options;
  serve: boolean;
  win: TrojanWindow;
  messager: Messager
  constructor(options, serve: boolean) {
    this.options = options;
    this.messager = new Messager();
    this.serve = serve;
    this.win = new TrojanWindow(options, serve);
  }


  run() {

    const { options, messager } = this;

    try {
      // This method will be called when Electron has finished
      // initialization and is ready to create browser windows.
      // Some APIs can only be used after this event occurs.
      // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
      app.on("ready", () => {
        initTray(options, app);
        messager.init();
        const menu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(menu);

        setTimeout(() => {
          this.win.create();
        }, 400);
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
        this.win.create();
      });
    } catch (e) {
      // Catch Error
      // throw e;
    }
  }
}