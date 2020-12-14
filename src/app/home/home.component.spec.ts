import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { HomeComponent } from "./home.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterTestingModule } from "@angular/router/testing";
import { unlinkSync, openSync, closeSync, chmodSync, existsSync, writeFileSync } from "fs";

const config = require("../../assets/config.json");

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
    "should update config file",
    waitForAsync(() => {
      const filename = "./config.json";
      var fd = openSync(filename, "w");
      writeFileSync(fd, JSON.stringify(config));
      closeSync(fd);
      console.log(filename);
      expect(existsSync(filename)).toBeTrue();
      expect(component.updateConfigWithFile(filename)).toBeTrue();
      expect(component.updateConfigWithFile(filename + "1")).toBeFalse();
      unlinkSync(filename);
    })
  );
});
