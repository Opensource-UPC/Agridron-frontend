import {ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, signal} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {TranslatePipe} from '@ngx-translate/core';
import {ReportPdfService} from '../../report-pdf.service';
import {ReportRow} from '../../report-row.model';

@Component({
  imports: [DatePipe, DecimalPipe, RouterLink, MatTableModule, MatPaginatorModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: 'app-supply-usage-table',
  styleUrl: './supply-usage-table.css',
  templateUrl: './supply-usage-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplyUsageTable {
  private readonly pdfService = inject(ReportPdfService);

  rows: InputSignal<ReportRow[]> = input.required<ReportRow[]>();

  loading: InputSignal<boolean> = input(false);

  protected readonly displayedColumns = ['mission', 'parcel', 'type', 'date', 'area', 'volume', 'density', 'actions'];

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

  protected density(row: ReportRow): number | null {
    return row.report.treatedArea > 0 ? row.report.appliedVolume / row.report.treatedArea : null;
  }

  protected download(row: ReportRow): void {
    void this.pdfService.download(row.report, row.parcelName, row.farmName);
  }
}
