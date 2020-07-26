import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { ipcRenderer } from "electron";

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

  constructor(private router: Router) {
    console.log(config);
  }

  ngOnInit(): void {}

  async onSelectFile(target) {
    this.execFile = target.files[0].path;

    console.log("on selected " , this.execFile);
    // if (this.process) {
    //   this.process.kill();
    //   this.process = null;
    // }

    ipcRenderer.send("file-open", this.execFile);

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
}
