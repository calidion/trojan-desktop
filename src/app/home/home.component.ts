import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
  existsSync,
  constants,
  accessSync,
  readFileSync,
  writeFileSync,
  openSync,
  closeSync,
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
    // console.log(faLink);
  }

  ngOnInit(): void {
    this.updateFileStatus("FILE.NOT.SELECTED");
    this.initConfig(this.possibleExecPath, this.possibleConfigPath);
  }

  initConfig(execPaths: Array<string>, configPaths: Array<string>): void {
    this.execFile = this.findFile(execPaths);

    this.configFile = this.findFile(configPaths);
    if (this.configFile !== "") {
      this.config = this.readConfig(this.configFile);
    } else {
      this.config = this.readConfig(resolve(__dirname, "../../assets/config.json"));
    }
  }

  findFile(paths: Array<string>): string {
    let found: string = "";
    for (const fsExec of paths) {
      if (existsSync(fsExec)) {
        found = fsExec;
        break;
      }
    }
    return found;
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
      writeFileSync(configFile, JSON.stringify(this.config));
      return true;
    } catch (e) {
      this.i18nAlert("FILE.SAVE.ERROR");
      return false;
    }
  }

  updateFileStatus(i18nID: string, withAlert = false): void {
    this.translate.get(i18nID).subscribe((title) => {
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

  onDisConnect(): boolean {
    return true;
  }
  onConnect(): boolean {
    return this.connect(this.execFile, this.configFile);
  }

  connect(execFile: string, configFile: string): boolean {
    if (!execFile) {
      this.updateFileStatus("FILE.NOT.SELECTED", true);
      return false;
    }
    if (!existsSync(execFile)) {
      this.updateFileStatus("FILE.NOT.EXIST", true);
      return false;
    } else {
      this.updateFileStatus("FILE.FOUND", true);
      this.connected = true;
      this.createProcess(execFile, configFile);
    }
    return false;
  }

  createProcess(filename: string, configFilename: string): void {
    ipcRenderer.send("file-open", filename, configFilename);
  }

  onSelectExeFile(target: HTMLInputElement): void {
    const tempfile = target.files[0].path;
    if (this.checkExeFile(this.execFile)) {
      this.execFile = tempfile;
    }
  }

  checkExeFile(execFile: string): boolean {
    try {
      accessSync(execFile, constants.X_OK);
      return true;
    } catch (e) {
      this.i18nAlert("FILE.NEED.EXECUTABLE");
      return false;
    }
  }

  onSelectConfigFile(target: HTMLInputElement): void {
    this.updateConfigWithFile(target.files[0].path);
  }

  updateConfigWithFile(filename: string): boolean {
    const config = this.readConfig(filename);

    if (config === false) {
      return false;
    }
    this.config = config;
    this.configFile = filename;
    return true;
  }

  save(filename, config) : void {
    const fd = openSync(filename, "w");
    writeFileSync(fd, JSON.stringify(config));
    closeSync(fd);
  }

  onSave(): void {
    // TODO: add actions
    this.save(this.configFile, this.config);
  }

  onSaveAs(): void {
    const { dialog, app } = remote;
    const toLocalPath = resolve(app.getPath("userData"), "./trojan.json");
    const userChosenPath = dialog.showSaveDialogSync({
      defaultPath: toLocalPath,
    });

    if (!existsSync(userChosenPath)) {
      // dialog.showOpenDialogSync()
      this.configFile = toLocalPath;
    } else {
      this.configFile = userChosenPath;
    }
    this.save(this.configFile, this.config);
  }
}
