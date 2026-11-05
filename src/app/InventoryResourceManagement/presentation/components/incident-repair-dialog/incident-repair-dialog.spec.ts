import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IncidentRepairDialog } from "./incident-repair-dialog";

describe("IncidentRepairDialog", () => {
  let component: IncidentRepairDialog;
  let fixture: ComponentFixture<IncidentRepairDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentRepairDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentRepairDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
