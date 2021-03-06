import { Component } from "@angular/core";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";

import { Title } from "@angular/platform-browser";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private title: Title
  ) {
    this.translate.setDefaultLang("zh");
  }

  ngOnInit(): void {
    this.translate.get("TITLE").subscribe((title) => {
      this.title.setTitle(title);
    });
  }
}
