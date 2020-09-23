import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { existsSync, constants, accessSync, readFileSync } from "fs";

import { ipcRenderer } from "electron";

import { TranslateService } from "@ngx-translate/core";

import { faLink, faUnlink, faCog } from "@fortawesome/free-solid-svg-icons";

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
    "/usr/local/etc/trojan/config.json",
    "/etc/trojan/config.json",
  ];
  // possibleCertificatePath = ["/usr/local/etc/trojan/fullchain.cer", "/etc/trojan/fullchain.cer"];

  connected = false;

  selected = false;

  selectedError = "";

  config: any = {
    ssl: {},
    password: [""],
  };

  execFile: string;

  // fa
  faLink = faLink;
  faUnlink = faUnlink;
  faCog = faCog;

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
      }
    }

    for (const fsPath of this.possibleConfigPath) {
      console.log("fsPath", fsPath);
      if (existsSync(fsPath)) {
        console.log("exist");
        try {
          const rawText = readFileSync(fsPath);
          this.config = JSON.parse(String(rawText));
          this.config.local_port++;
          console.log(this.config);
        } catch (e) {
          this.i18nAlert("FILE.FORMAT.WRONG");
        }
      }
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
      this.createProcess(this.execFile);
    }
    return false;
  }

  createProcess(filename: string): void {
    // if (this.process) {
    //   this.process.kill();
    //   this.process = null;
    // }

    ipcRenderer.send("file-open", filename);

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
}
