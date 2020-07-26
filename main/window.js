"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var url = require("url");
var win = null;
function createWindowInner(options, serve, app) {
    var icon = options.icon, local = options.local;
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
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
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
    }
    else {
        win.loadURL(url.format({
            pathname: options.local.file,
            protocol: "file:",
            slashes: true,
        }));
    }
    // Emitted when the window is closed.
    win.on("closed", function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
    return win;
}
function createWindow(options, serve, app) {
    return function () {
        if (win) {
            return win;
        }
        return createWindowInner(options, serve, app);
    };
}
exports.createWindow = createWindow;
//# sourceMappingURL=window.js.map