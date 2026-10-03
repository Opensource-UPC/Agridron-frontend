import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionReportStore} from '../../../application/mission-report.store';
import {downloadTextFile} from '../../download-text-file';

/**
 * Detail view of a single mission report with its operational metrics.
 */
@Component({
  imports: [DatePipe, DecimalPipe, RouterLink, MatButtonModule, MatCardModule, MatIcon, TranslatePipe],
  selector: 'app-report-detail',
  styleUrl: './report-detail.css',
  templateUrl: './report-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportDetail {
  private readonly reportStore = inject(MissionReportStore);
  private readonly route = inject(ActivatedRoute);

  private readonly reportId = Number(this.route.snapshot.paramMap.get('id'));

  protected readonly report = this.reportStore.getReportById(this.reportId);

  protected readonly loading = this.reportStore.loading;

  protected readonly error = this.reportStore.error;

  protected readonly hasMetrics = computed(() => (this.report()?.metrics.length ?? 0) > 0);

  protected download(format: 'json' | 'csv'): void {
    const report = this.report();
    if (!report) {
      return;
    }
    const mime = format === 'json' ? 'application/json' : 'text/csv';
    downloadTextFile(`mission-report-${report.id}.${format}`, report.export(format), mime);
  }
}
