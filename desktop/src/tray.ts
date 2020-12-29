import { Tray, Menu, app } from 'electron';
import { closeSync, existsSync, openSync, writeFileSync } from 'fs';
import * as path from 'path';

let tray: Tray = null;

export function initTray(options, app) {
  tray = new Tray(options.icon.file);
  const contextMenu = Menu.buildFromTemplate([
    // { label: "Disconnect", type: "radio", checked: true },
    // { label: "Connect", type: "radio" },
    {
      label: "Create Desktop Entry", click() {
        createDesktopEntry(options);
      },
    },
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

export function createDesktopEntry(options) {
  const home = app.getPath('home');
  const entry = path.resolve(home, ".config/autostart/trojan-desktop.desktop");
  console.log(entry);
  if (!existsSync(entry)) {
    const fd = openSync(entry, "w");

    const entryText = `[Desktop Entry]
Name=Trojan
Comment=Trojan Client Desktop
Icon=${options.icon.file}
Exec=$
X-GNOME-Autostart-enabled=true
Terminal=false
Type=Application
`;
    console.log(entryText);
    writeFileSync(fd, entryText);
    closeSync(fd);
  }
}
