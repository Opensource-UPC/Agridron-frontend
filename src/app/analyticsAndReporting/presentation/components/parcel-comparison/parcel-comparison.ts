import {ChangeDetectionStrategy, Component, computed, input, InputSignal, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {TranslatePipe} from '@ngx-translate/core';
import {ReportRow, uniqueByMission} from '../../report-row.model';

/**
 * Parcel that can be selected for comparison.
 */
export interface ParcelOption {
  id: number;
  name: string;
  farmName: string;
}

interface ParcelComparisonRow {
  id: number;
  name: string;
  farmName: string;
  missions: number;
  treatedArea: number;
  appliedVolume: number;
  density: number | null;
}

@Component({
  imports: [DecimalPipe, MatFormFieldModule, MatSelectModule, MatTableModule, TranslatePipe],
  selector: 'app-parcel-comparison',
  styleUrl: './parcel-comparison.css',
  templateUrl: './parcel-comparison.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParcelComparison {
  rows: InputSignal<ReportRow[]> = input.required<ReportRow[]>();

  parcels: InputSignal<ParcelOption[]> = input.required<ParcelOption[]>();

  protected readonly displayedColumns = ['parcel', 'missions', 'area', 'volume', 'density', 'bar'];

  protected readonly selectedIds = signal<number[]>([]);

  protected readonly comparison = computed<ParcelComparisonRow[]>(() => {
    const missions = uniqueByMission(this.rows());
    return this.parcels()
      .filter(parcel => this.selectedIds().includes(parcel.id))
      .map(parcel => {
        const own = missions.filter(row => row.report.parcelId === parcel.id);
        const treatedArea = own.reduce((sum, row) => sum + row.report.treatedArea, 0);
        const appliedVolume = own.reduce((sum, row) => sum + row.report.appliedVolume, 0);
        return {
          id: parcel.id,
          name: parcel.name,
          farmName: parcel.farmName,
          missions: own.length,
          treatedArea,
          appliedVolume,
          density: treatedArea > 0 ? appliedVolume / treatedArea : null
        };
      });
  });

  private readonly maxDensity = computed(() =>
    Math.max(0, ...this.comparison().map(row => row.density ?? 0)));

  protected onSelectionChange(ids: number[]): void {
    this.selectedIds.set(ids);
  }

  protected barWidth(row: ParcelComparisonRow): number {
    const max = this.maxDensity();
    return max > 0 && row.density !== null ? (row.density / max) * 100 : 0;
  }
}
