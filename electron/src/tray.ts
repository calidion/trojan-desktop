import { App, Menu, Tray } from 'electron';

let tray: Tray;

export function initTray(iconFile: string, app: App) {
  tray = new Tray(iconFile);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Disconnect', type: 'radio', checked: true },
    { label: 'Connect', type: 'radio' },
    { label: 'Settings', type: 'radio' },
    {
      label: 'Exit',
      click() {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('This is my application.');
  tray.setContextMenu(contextMenu);
}
