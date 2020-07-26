"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var tray = null;
function initTray(iconFile, app) {
    tray = new electron_1.Tray(iconFile);
    var contextMenu = electron_1.Menu.buildFromTemplate([
        { label: "Disconnect", type: "radio", checked: true },
        { label: "Connect", type: "radio" },
        { label: "Settings", type: "radio" },
        {
            label: "Exit",
            click: function () {
                app.quit();
            },
        },
    ]);
    tray.setToolTip("This is my application.");
    tray.setContextMenu(contextMenu);
}
exports.initTray = initTray;
//# sourceMappingURL=tray.js.map