import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MaintenanceRegisterDialog } from "./maintenance-register-dialog";

describe("MaintenanceRegisterDialog", () => {
  let component: MaintenanceRegisterDialog;
  let fixture: ComponentFixture<MaintenanceRegisterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRegisterDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(MaintenanceRegisterDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
