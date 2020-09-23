import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { existsSync } from "fs";

import { ipcRenderer } from "electron";

import { TranslateService } from "@ngx-translate/core";

import { faLink, faUnlink } from "@fortawesome/free-solid-svg-icons";

const config = require("../../assets/config.json");

// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  // private process: ChildProcess;
  private execFile: string;

  private strFileStatus = "";

  connected = false;

  // fa
  faLink = faLink;
  faUnlink = faUnlink;

  constructor(private router: Router, private translate: TranslateService) {
    console.log(config);
    console.log(faLink);
  }

  ngOnInit(): void {
    this.updateFileStatus("FILE.NOT.SELECTED");
  }

  updateFileStatus(i18nID: string, withAlert = false): void {
    this.translate.get(i18nID).subscribe((title) => {
      this.strFileStatus = title;
      if (withAlert) {
        alert(this.strFileStatus);
      }
    });
  }

  onSubmit() : boolean {
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
    console.log("on selected ", this.execFile);
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

  onSelectFile(target: HTMLInputElement): void {
    this.execFile = target.files[0].path;
  }
}
