import { Tray, Menu } from "electron";

let tray: Tray = null;

export function initTray(iconFile, app) {
  tray = new Tray(iconFile);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Disconnect", type: "radio", checked: true },
    { label: "Connect", type: "radio" },
    { label: "Settings", type: "radio" },
    {
      label: "Exit",
      click() {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}
