import {ChangeDetectionStrategy, Component, computed, input, InputSignal, signal} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionReport} from '../../../domain/model/mission-report.entity';
import {downloadTextFile} from '../../download-text-file';

@Component({
  imports: [DatePipe, DecimalPipe, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: 'app-supply-usage-table',
  styleUrl: './supply-usage-table.css',
  templateUrl: './supply-usage-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplyUsageTable {
  reports: InputSignal<MissionReport[]> = input.required<MissionReport[]>();

  loading: InputSignal<boolean> = input(false);

  protected readonly displayedColumns = ['mission', 'type', 'date', 'area', 'volume', 'density', 'actions'];

  protected readonly pageSize = signal(5);

  protected readonly pageIndex = signal(0);

  protected readonly pageRows = computed(() => {
    const size = this.pageSize();
    const lastPage = Math.max(0, Math.ceil(this.reports().length / size) - 1);
    const start = Math.min(this.pageIndex(), lastPage) * size;
    return this.reports().slice(start, start + size);
  });

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected density(report: MissionReport): number | null {
    return report.treatedArea > 0 ? report.appliedVolume / report.treatedArea : null;
  }

  protected download(report: MissionReport): void {
    downloadTextFile(`mission-report-${report.id}.csv`, report.export('csv'), 'text/csv');
  }
}
