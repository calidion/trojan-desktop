import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
  existsSync,
  constants,
  accessSync,
  readFileSync,
  writeFileSync,
} from "fs";

import { ipcRenderer } from "electron";

import { TranslateService } from "@ngx-translate/core";

import {
  faLink,
  faUnlink,
  faCog,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { resolve } from "path";

import { remote } from "electron";

// const config = require("../../assets/config.json");

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  // private process: ChildProcess;

  private strFileStatus = "";

  possibleExecPath = ["/usr/bin/trojan", "/usr/local/bin/trojan"];

  possibleConfigPath = [
    "/etc/trojan/config.json",
    "/usr/local/etc/trojan/config.json",
  ];

  // possibleCertificatePath = ["/usr/local/etc/trojan/fullchain.cer", "/etc/trojan/fullchain.cer"];

  connected = false;

  selected = false;

  selectedError = "";

  config;

  execFile: string;
  configFile: string;

  // Process Status
  started = false;

  // fa
  faLink = faLink;
  faUnlink = faUnlink;
  faCog = faCog;
  faSave = faSave;

  constructor(private router: Router, private translate: TranslateService) {
    console.log(faLink);
  }

  ngOnInit(): void {
    console.log("ng on init");
    this.updateFileStatus("FILE.NOT.SELECTED");
    this.initConfig();
  }

  initConfig(): void {
    for (const fsExec of this.possibleExecPath) {
      console.log("fsExec", fsExec);
      if (existsSync(fsExec)) {
        this.execFile = fsExec;
        break;
      }
    }

    for (const fsPath of this.possibleConfigPath) {
      console.log("fsPath", fsPath);
      if (existsSync(fsPath)) {
        console.log("exist");
        const config = this.readConfig(fsPath);

        if (config === false) {
          continue;
        }
        this.config = config;
        console.log(this.config);
        this.configFile = fsPath;
        return;
      }
    }
    this.config = this.readConfig(
      resolve(__dirname, "../../assets/config.json")
    );
  }

  readConfig(configFile: string): boolean {
    try {
      const rawText = readFileSync(configFile);
      const json = JSON.parse(String(rawText));
      return json;
    } catch (e) {
      this.i18nAlert("FILE.FORMAT.WRONG");
      return false;
    }
  }

  saveConfig(configFile: string): boolean {
    try {
      console.log(configFile, this.config);
      writeFileSync(configFile, JSON.stringify(this.config));
    } catch (e) {
      this.i18nAlert("FILE.SAVE.ERROR");
      return false;
    }
  }

  updateFileStatus(i18nID: string, withAlert = false): void {
    this.translate.get(i18nID).subscribe((title) => {
      console.log(title);
      this.strFileStatus = title;
      if (withAlert) {
        alert(this.strFileStatus);
      }
    });
  }

  i18nAlert(id: string): void {
    this.translate.get(id).subscribe((title) => {
      alert(title);
    });
  }

  onSubmit(): boolean {
    console.log("on submit");
    console.log(this.execFile);
    if (!this.execFile) {
      this.updateFileStatus("FILE.NOT.SELECTED", true);
      return false;
    }
    if (!existsSync(this.execFile)) {
      this.updateFileStatus("FILE.NOT.EXIST", true);
      return false;
    } else {
      this.updateFileStatus("FILE.FOUND", true);
      this.createProcess(this.execFile, this.configFile);
    }
    return false;
  }

  createProcess(filename: string, configFilename: string): void {
    // if (this.process) {
    //   this.process.kill();
    //   this.process = null;
    // }

    ipcRenderer.send("file-open", filename, configFilename);

    // const cmd = this.execFile + " --help";

    // this.process = exec(cmd, (error, stdout, stderr) => {
    //   if (error) {
    //     console.log(error);
    //     console.log(stderr);
    //     return;
    //   }
    //   console.log(stdout);
    // });

    // console.log(this.process);

    // this.process.stdout.setEncoding("utf8");

    // this.process.stdout.on("data", function (data) {
    //   console.log(data);
    //   console.log(data.toString());
    // });

    // this.process.stdin.on("data", function (data) {

    //   process.send(data);
    // });

    // console.log(target.files[0].path);

    // process.on("message", (data) => {
    //   console.log(data);
    //   console.log(data.toString());
    //   console.log(data);
    // })
  }

  onSelectFile(target: HTMLInputElement): boolean {
    this.execFile = target.files[0].path;
    try {
      accessSync(this.execFile, constants.X_OK);
    } catch (e) {
      console.log(e);
      target.value = "";
      this.i18nAlert("FILE.NEED.EXECUTABLE");
      return false;
    }
  }

  onSelectConfigFile(target: HTMLInputElement): boolean {
    const fsPath = target.files[0].path;
    const config = this.readConfig(fsPath);

    if (config === false) {
      return;
    }
    this.config = config;
    console.log(this.config);
    this.configFile = fsPath;
    return;
  }

  onSave(): void {
    // TODO: add actions
  }

  onSaveAs(): void {
    const { dialog, app } = remote;
    const toLocalPath = resolve(app.getPath("userData"), "./trojan.json");
    const userChosenPath = dialog.showSaveDialogSync({
      defaultPath: toLocalPath,
    });

    if (existsSync(userChosenPath)) {
      // dialog.showOpenDialogSync()
    }
    try {
      console.log(userChosenPath);
      this.saveConfig(userChosenPath);
      console.log("config file saved!");
      this.configFile = userChosenPath;
    } catch (e) {
      console.error(e);
    }
  }
}
