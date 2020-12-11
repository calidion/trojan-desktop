import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { TranslateModule } from "@ngx-translate/core";
import { ElectronService } from "./core/services";

describe("AppComponent", () => {
  let fixture, app;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent],
        providers: [ElectronService],
        imports: [RouterTestingModule, TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(AppComponent);
      app = fixture.debugElement.componentInstance;
      app.ngOnInit();
    })
  );

  it(
    "should create the app",
    waitForAsync(() => {
      expect(app).toBeTruthy();
    })
  );

  it(
    "should be able to show env",
    waitForAsync(() => {

      app.showEnv(false);
      expect(app).toBeTruthy();
    })
  );
});
