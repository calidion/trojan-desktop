import { Tray, Menu } from "electron";

let tray: Tray = null;

export function initTray(options, app) {
  tray = new Tray(options.icon.file);
  const contextMenu = Menu.buildFromTemplate([
    // { label: "Disconnect", type: "radio", checked: true },
    // { label: "Connect", type: "radio" },
    { label: "Settings", icon: options.icon.settings },
    {
      label: "Exit",
      icon: options.icon.exit,
      click() {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("This is my application.");
  tray.setContextMenu(contextMenu);
}
