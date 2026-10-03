import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionHistoryStore} from '../../../application/mission-history.store';
import {MissionReportStore} from '../../../application/mission-report.store';
import {PerformanceIndicatorStore} from '../../../application/performance-indicator.store';
import {ReportType} from '../../../domain/model/report-type.enum';
import {MissionHistoryRow, MissionHistoryTable} from '../mission-history-table/mission-history-table';
import {PerformanceIndicatorList} from '../performance-indicator-list/performance-indicator-list';
import {SupplyUsageTable} from '../supply-usage-table/supply-usage-table';

/**
 * Reports and history page: mission history, supply usage and performance indicators.
 */
@Component({
  imports: [
    NgTemplateOutlet, MatTabsModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslatePipe,
    MissionHistoryTable, SupplyUsageTable, PerformanceIndicatorList
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

  protected readonly loading = computed(() =>
    this.reportStore.loading() || this.historyStore.loading() || this.indicatorStore.loading());

  protected readonly error = computed(() =>
    this.reportStore.error() ?? this.historyStore.error() ?? this.indicatorStore.error());

  protected readonly indicators = this.indicatorStore.indicators;

  protected readonly draftFrom = signal('');
  protected readonly draftTo = signal('');
  private readonly appliedFrom = signal('');
  private readonly appliedTo = signal('');

  private readonly inRange = (isoDate: string): boolean => {
    const day = isoDate.slice(0, 10);
    const from = this.appliedFrom();
    const to = this.appliedTo();
    return (!from || day >= from) && (!to || day <= to);
  };

  protected readonly historyRows = computed<MissionHistoryRow[]>(() => {
    const reports = this.reportStore.reports();
    return this.historyStore.histories()
      .filter(history => this.inRange(history.completedAt))
      .map(history => {
        const missionReports = reports.filter(r => r.missionId === history.missionId);
        const report = missionReports.find(r => r.type === ReportType.MISSION_SUMMARY) ?? missionReports[0] ?? null;
        return {
          id: history.id,
          missionId: history.missionId,
          finalStatus: history.finalStatus,
          completedAt: history.completedAt,
          treatedArea: report ? report.treatedArea : null,
          report
        };
      });
  });

  protected readonly filteredReports = computed(() =>
    this.reportStore.reports().filter(report => this.inRange(report.generatedAt)));

  protected onFromChange(event: Event): void {
    this.draftFrom.set((event.target as HTMLInputElement).value);
  }

  protected onToChange(event: Event): void {
    this.draftTo.set((event.target as HTMLInputElement).value);
  }

  protected applyFilter(): void {
    this.appliedFrom.set(this.draftFrom());
    this.appliedTo.set(this.draftTo());
  }

  protected clearFilter(): void {
    this.draftFrom.set('');
    this.draftTo.set('');
    this.appliedFrom.set('');
    this.appliedTo.set('');
  }
}
