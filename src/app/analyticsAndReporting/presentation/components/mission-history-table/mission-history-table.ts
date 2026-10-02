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

/**
 * Row shown in the mission history table (history record joined with its report).
 */
export interface MissionHistoryRow {
  id: number;
  missionId: number;
  finalStatus: string;
  completedAt: string;
  treatedArea: number | null;
  report: MissionReport | null;
}

@Component({
  imports: [DatePipe, DecimalPipe, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: 'app-mission-history-table',
  styleUrl: './mission-history-table.css',
  templateUrl: './mission-history-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionHistoryTable {
  rows: InputSignal<MissionHistoryRow[]> = input.required<MissionHistoryRow[]>();

  loading: InputSignal<boolean> = input(false);

  error: InputSignal<string | null> = input<string | null>(null);

  protected readonly displayedColumns = ['id', 'date', 'status', 'area', 'actions'];

  protected readonly pageSize = signal(5);

  protected readonly pageIndex = signal(0);

  protected readonly pageRows = computed(() => {
    const size = this.pageSize();
    const lastPage = Math.max(0, Math.ceil(this.rows().length / size) - 1);
    const start = Math.min(this.pageIndex(), lastPage) * size;
    return this.rows().slice(start, start + size);
  });

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected download(row: MissionHistoryRow): void {
    if (!row.report) {
      return;
    }
    downloadTextFile(`mission-report-${row.report.id}.csv`, row.report.export('csv'), 'text/csv');
  }
}
