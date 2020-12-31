import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import {
  existsSync,
  constants,
  accessSync,
  readFileSync,
  writeFileSync,
  openSync,
  closeSync,
  mkdirSync,
  lstatSync,
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

  enabled = false;

  dismissed = false;

  selectedError = "";

  config;

  execFile: string;
  configFile: string;

  // Process Status
  started = false;

  // Error Message
  serviceError = false;
  connectError = false;
  serviceMessage = "";
  connectMessage = "";

  // Linux Service Status
  serviceExistance = false;

  // fa
  faLink = faLink;
  faUnlink = faUnlink;
  faCog = faCog;
  faSave = faSave;

  interval = 5000;
  check = false;


  previousStatus = false;

  constructor(private router: Router, private translate: TranslateService,
    private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.updateFileStatus("FILE.NOT.SELECTED");
    this.initConfig(this.possibleExecPath, this.possibleConfigPath);

    this.initService();
  }

  initConfig(execPaths: Array<string>, configPaths: Array<string>): void {
    this.execFile = this.findFile(execPaths);

    this.configFile = this.findFile(configPaths);
    if (this.configFile !== "") {
      this.config = this.readConfig(this.configFile);
    } else {
      this.config = this.readConfig(
        resolve(__dirname, "../../assets/config.json")
      );
    }
  }


  // Service related functions

  initService() {
    this.onConnect();
    const cmd = "service";

    ipcRenderer.once(cmd, (event, error, message) => {
      if (!error) {
        this.enabled = true;
        this.dismissed = false;
      } else {
        this.enabled = false;
        this.serviceError = error;
        this.serviceMessage = message;
      }
      this.cd.detectChanges();
    });
    this.getServiceStatus();

  }

  getServiceStatus() {
    ipcRenderer.send("service", 'status');
  }

  onEnableService() {
    ipcRenderer.send("service", 'start', this.execFile, this.configFile);
  }

  onDisableService() {
    ipcRenderer.send("service", 'stop', this.execFile, this.configFile);
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

      }
    });
  }

  i18nAlert(id: string, message?: string): void {
    this.translate.get(id).subscribe((title: string) => {
      const options = {
        title,
        body: message ? message : title
      }
      try {
        const notify = new remote.Notification(options);
        notify.show();
      } catch (e) {
        console.error(e);
      }
    });
  }

  onDisConnect(): void {
    return this.disconnect(this.execFile, this.configFile);
  }
  onConnect(): boolean {
    return this.connect(this.execFile, this.configFile);
  }

  disconnect(execFile: string, configFile: string): void {
    this.distroyProcess(execFile, configFile);
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
      this.updateFileStatus("FILE.EXE.FOUND", true);
      this.createProcess(execFile, configFile);
    }
    return false;
  }

  distroyProcess(filename: string, configFilename: string): void {
    const cmd = "trojan-stop";
    ipcRenderer.send(cmd, filename, configFilename);
    ipcRenderer.once(cmd, (event, error, message) => {
      if (!error) {
        this.connected = false;
        this.cd.detectChanges();
      }
    });
  }

  createProcess(filename: string, configFilename: string): void {
    const cmd = "trojan-run";
    ipcRenderer.send(cmd, filename, configFilename);
    ipcRenderer.on(cmd, (event, error, message) => {
      if (!error) {
        this.connected = true;
      } else {
        this.connected = false;
        this.connectError = error;
        this.connectMessage = message.message;
      }
      this.cd.detectChanges();
    });
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

  save(filename, config): void {
    try {
      const fd = openSync(filename, "w");
      writeFileSync(fd, JSON.stringify(config));
      closeSync(fd);

    } catch (e) {
      this.i18nAlert("FILE.SAVE.ERROR", e.message);
    }
  }

  onSave(): void {
    this.save(this.configFile, this.config);
  }

  getDefaultDir() {
    const dir = resolve(remote.app.getPath("userData"), "./data");

    if (!existsSync(dir)) {
      mkdirSync(dir);
    } else {
      const stats = lstatSync(dir);
      if (!stats.isDirectory()) {
        throw new Error("Should be a directory instead of a file!");
      }
    }
    return dir;
  }

  onSaveAs(): void {

    this.translate.get("FILE.SAVE.TITLE").subscribe((title: string) => {

      const toLocalPath = this.getDefaultDir() + "/config.json";
      const userChosenPath = remote.dialog.showSaveDialogSync(remote.getCurrentWindow(), {
        title,
        defaultPath: toLocalPath,
        filters: [
          { name: 'JSON(*.json)', extensions: ['json'] },
          { name: '*', extensions: ['*'] }
        ]
      });

      if (!userChosenPath) {
        return;
      } else {
        this.configFile = userChosenPath;
      }
      this.save(this.configFile, this.config);
    });
  }

  closeError() {
    this.connectError = false;
    this.cd.detectChanges();
  }

  closeServiceError() {
    this.serviceError = false;
    this.cd.detectChanges();
  }

  closeEnableError() {
    this.dismissed = true;
    this.cd.detectChanges();
  }
}
