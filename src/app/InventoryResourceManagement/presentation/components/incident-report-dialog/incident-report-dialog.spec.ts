import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IncidentReportDialog } from "./incident-report-dialog";

describe("IncidentReportDialog", () => {
  let component: IncidentReportDialog;
  let fixture: ComponentFixture<IncidentReportDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentReportDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentReportDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
