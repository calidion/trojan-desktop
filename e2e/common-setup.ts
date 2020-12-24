const Application = require('spectron').Application;
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

export default function setup(): void {
  beforeEach(async function () {
    const filename = path.join(__dirname, '../dist/desktop');
    console.log(filename);
    this.app = new Application({
      // Your electron path can be any binary
      // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
      // But for the sake of the example we fetch it from our node_modules.
      path: electronPath,

      // Assuming you have the following directory structure

      //  |__ my project
      //     |__ ...
      //     |__ main.js
      //     |__ package.json
      //     |__ index.html
      //     |__ ...
      //     |__ test
      //        |__ spec.js  <- You are here! ~ Well you should be.

      // The following line tells spectron to look and use the main.js file
      // and the package.json located 1 level above.
      args: [filename],
      webdriverOptions: {}
    });

    console.log(this.app);

    await this.app.start();
  });

  afterEach(async function () {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
    }
  });
}
