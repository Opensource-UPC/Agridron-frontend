import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';
import {TranslatePipe} from '@ngx-translate/core';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {MissionHistoryStore} from '../../../application/mission-history.store';
import {MissionReportStore} from '../../../application/mission-report.store';
import {PerformanceIndicatorStore} from '../../../application/performance-indicator.store';
import {ReportType} from '../../../domain/model/report-type.enum';
import {ReportRow} from '../../report-row.model';
import {FarmConsumptionSummary} from '../farm-consumption-summary/farm-consumption-summary';
import {MissionHistoryRow, MissionHistoryTable} from '../mission-history-table/mission-history-table';
import {ParcelComparison, ParcelOption} from '../parcel-comparison/parcel-comparison';
import {PerformanceIndicatorList} from '../performance-indicator-list/performance-indicator-list';
import {SupplyUsageTable} from '../supply-usage-table/supply-usage-table';

/**
 * Reports and history page: mission history, supply usage, parcel comparison and performance indicators.
 */
@Component({
  imports: [
    NgTemplateOutlet, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, TranslatePipe,
    MissionHistoryTable, SupplyUsageTable, FarmConsumptionSummary, ParcelComparison, PerformanceIndicatorList
  ],
  selector: 'app-reports-page',
  styleUrl: './reports-page.css',
  templateUrl: './reports-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsPage {
  private readonly reportStore = inject(MissionReportStore);
  private readonly historyStore = inject(MissionHistoryStore);
  private readonly indicatorStore = inject(PerformanceIndicatorStore);
  private readonly farmStore = inject(FarmStore);
  private readonly parcelStore = inject(ParcelStore);

  protected readonly loading = computed(() =>
    this.reportStore.loading() || this.historyStore.loading() || this.indicatorStore.loading());

  protected readonly error = computed(() =>
    this.reportStore.error() ?? this.historyStore.error() ?? this.indicatorStore.error());

  protected readonly indicators = this.indicatorStore.indicators;

  protected readonly farms = this.farmStore.farms;

  protected readonly draftFrom = signal('');
  protected readonly draftTo = signal('');
  protected readonly draftFarmId = signal<number | null>(null);
  private readonly appliedFrom = signal('');
  private readonly appliedTo = signal('');
  private readonly appliedFarmId = signal<number | null>(null);

  /** Parcel id -> parcel and farm names (read from field management). */
  private readonly parcelLookup = computed(() => {
    const farmNames = new Map(this.farmStore.farms().map(farm => [farm.id, farm.name]));
    return new Map(this.parcelStore.parcels().map(parcel => [parcel.id, {
      name: parcel.name,
      farmId: parcel.farmId,
      farmName: farmNames.get(parcel.farmId) ?? '—'
    }]));
  });

  private readonly resolveParcel = (parcelId: number) => {
    const info = this.parcelLookup().get(parcelId);
    return {
      parcelName: info?.name ?? `#${parcelId}`,
      farmId: info?.farmId ?? null,
      farmName: info?.farmName ?? '—'
    };
  };

  private readonly inRange = (isoDate: string): boolean => {
    const day = isoDate.slice(0, 10);
    const from = this.appliedFrom();
    const to = this.appliedTo();
    return (!from || day >= from) && (!to || day <= to);
  };

  private readonly matchesFarm = (parcelId: number): boolean => {
    const farmId = this.appliedFarmId();
    return farmId === null || this.resolveParcel(parcelId).farmId === farmId;
  };

  protected readonly historyRows = computed<MissionHistoryRow[]>(() => {
    const reports = this.reportStore.reports();
    return this.historyStore.histories()
      .filter(history => this.inRange(history.completedAt) && this.matchesFarm(history.parcelId))
      .map(history => {
        const missionReports = reports.filter(r => r.missionId === history.missionId);
        const report = missionReports.find(r => r.type === ReportType.MISSION_SUMMARY) ?? missionReports[0] ?? null;
        const parcel = this.resolveParcel(history.parcelId);
        return {
          id: history.id,
          missionId: history.missionId,
          parcelName: parcel.parcelName,
          farmName: parcel.farmName,
          finalStatus: history.finalStatus,
          completedAt: history.completedAt,
          treatedArea: report ? report.treatedArea : null,
          report
        };
      });
  });

  protected readonly reportRows = computed<ReportRow[]>(() =>
    this.reportStore.reports()
      .filter(report => this.inRange(report.generatedAt) && this.matchesFarm(report.parcelId))
      .map(report => {
        const parcel = this.resolveParcel(report.parcelId);
        return {report, parcelName: parcel.parcelName, farmId: parcel.farmId, farmName: parcel.farmName};
      }));

  protected readonly parcelOptions = computed<ParcelOption[]>(() =>
    this.parcelStore.parcels()
      .filter(parcel => this.matchesFarm(parcel.id))
      .map(parcel => ({id: parcel.id, name: parcel.name, farmName: this.resolveParcel(parcel.id).farmName})));

  protected onFromChange(event: Event): void {
    this.draftFrom.set((event.target as HTMLInputElement).value);
  }

  protected onToChange(event: Event): void {
    this.draftTo.set((event.target as HTMLInputElement).value);
  }

  protected applyFilter(): void {
    this.appliedFrom.set(this.draftFrom());
    this.appliedTo.set(this.draftTo());
    this.appliedFarmId.set(this.draftFarmId());
  }

  protected clearFilter(): void {
    this.draftFrom.set('');
    this.draftTo.set('');
    this.draftFarmId.set(null);
    this.appliedFrom.set('');
    this.appliedTo.set('');
    this.appliedFarmId.set(null);
  }
}
