import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  tick,
} from "@angular/core/testing";

import { HomeComponent } from "./home.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterTestingModule } from "@angular/router/testing";
import {
  unlinkSync,
  openSync,
  closeSync,
  chmodSync,
  existsSync,
  writeFileSync,
} from "fs";
import { By } from "@angular/platform-browser";

const config = require("../../assets/config.json");

declare global {
  namespace NodeJS {
    interface Global {
      alert(title: string): void;
    }
  }
}

global.alert = function (title: string) {
  console.log("inside alert", title);
};

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeComponent],
        imports: [
          FormsModule,
          FontAwesomeModule,
          TranslateModule.forRoot(),
          RouterTestingModule,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it(
    "should initConfig",
    waitForAsync(() => {
      component.initConfig([], []);
      component.updateFileStatus("FILE.NOT.SELECTED", true);
      component.onConnect();
      component.onDisConnect();
      expect(component.configFile).toBeFalsy();
    })
  );

  it(
    "should save config",
    waitForAsync(() => {
      const tempFile = "./tmp.json";
      let catched = component.saveConfig(tempFile);
      expect(catched !== false).toBeTrue();

      unlinkSync(tempFile);
      catched = component.saveConfig("/");
      expect(catched === false).toBeTrue();
    })
  );

  it(
    "should render title in a h1 tag",
    waitForAsync(() => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("h1").textContent).toContain(
        "PAGES.HOME.TITLE"
      );
    })
  );

  it(
    "should connect to electron",
    waitForAsync(() => {
      component.connect("aaa", "bbb");
      const filename = "./tmp";
      var fd = openSync(filename, "w");
      closeSync(fd);
      component.connect(filename, "bbb");
      expect(component.checkExeFile(filename)).toBeFalse();
      chmodSync(filename, 0o755);
      expect(component.checkExeFile(filename)).toBeTrue();
      unlinkSync(filename);
    })
  );

  it(
    "should clicked to connect",
    waitForAsync(() => {
      spyOn(component, "onConnect");
      spyOn(component, "onDisConnect");
      const connected: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".connected"
      );

      expect(connected).toBeTruthy();
      connected.click();
      expect(component.onConnect).toHaveBeenCalledTimes(1);
      expect(component.onDisConnect).toHaveBeenCalledTimes(0);
    })
  );

  it(
    "should clicked to disconnect",
    waitForAsync(() => {
      spyOn(component, "onConnect");
      spyOn(component, "onDisConnect");

      component.connected = true;

      fixture.detectChanges();

      const disconnected: HTMLButtonElement = fixture.nativeElement.querySelector(
        ".disconnected"
      );

      expect(disconnected).toBeTruthy();


      disconnected.click();

      expect(component.onConnect).toHaveBeenCalledTimes(0);
      expect(component.onDisConnect).toHaveBeenCalledTimes(1);
    })
  );

  it(
    "should select files",
    waitForAsync(() => {
      spyOn(component, "onSelectExeFile");

      const select: HTMLInputElement = fixture.nativeElement.querySelector(
        "#cmd"
      );
      expect(select).toBeTruthy();

      const change = new Event("change");
      select.dispatchEvent(change);
      // fixture.detectChanges();
      expect(component.onSelectExeFile).toHaveBeenCalledTimes(1);
    })
  );

  it(
    "should update config file",
    waitForAsync(() => {
      const filename = "./config.json";

      component.save(filename, config);
      expect(existsSync(filename)).toBeTrue();
      expect(component.updateConfigWithFile(filename)).toBeTrue();
      expect(component.updateConfigWithFile(filename + "1")).toBeFalse();
      unlinkSync(filename);
    })
  );
});
