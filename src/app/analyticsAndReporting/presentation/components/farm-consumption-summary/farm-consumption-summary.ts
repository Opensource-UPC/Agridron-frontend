import {ChangeDetectionStrategy, Component, computed, input, InputSignal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {TranslatePipe} from '@ngx-translate/core';
import {ReportRow, uniqueByMission} from '../../report-row.model';

/**
 * Aggregated consumption of one agrochemical product in one farm (RP-005).
 */
export interface FarmConsumption {
  farmName: string;
  productName: string;
  missions: number;
  treatedArea: number;
  appliedVolume: number;
  density: number | null;
}

@Component({
  imports: [DecimalPipe, MatTableModule, TranslatePipe],
  selector: 'app-farm-consumption-summary',
  styleUrl: './farm-consumption-summary.css',
  templateUrl: './farm-consumption-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FarmConsumptionSummary {
  rows: InputSignal<ReportRow[]> = input.required<ReportRow[]>();

  protected readonly displayedColumns = ['farm', 'product', 'missions', 'area', 'volume', 'density'];

  /** One row per farm and product, adding up the volume sprayed in each completed mission. */
  protected readonly groups = computed<FarmConsumption[]>(() => {
    const byFarmAndProduct = new Map<string, FarmConsumption>();
    for (const row of uniqueByMission(this.rows())) {
      const key = `${row.farmName}|${row.productName}`;
      const group = byFarmAndProduct.get(key) ?? {
        farmName: row.farmName, productName: row.productName,
        missions: 0, treatedArea: 0, appliedVolume: 0, density: null
      };
      group.missions += 1;
      group.treatedArea += row.report.treatedArea;
      group.appliedVolume += row.report.appliedVolume;
      byFarmAndProduct.set(key, group);
    }
    return [...byFarmAndProduct.values()]
      .map(g => ({...g, density: g.treatedArea > 0 ? g.appliedVolume / g.treatedArea : null}))
      .sort((a, b) => b.appliedVolume - a.appliedVolume);
  });

  protected readonly totals = computed(() => {
    const groups = this.groups();
    const treatedArea = groups.reduce((sum, g) => sum + g.treatedArea, 0);
    const appliedVolume = groups.reduce((sum, g) => sum + g.appliedVolume, 0);
    return {
      missions: groups.reduce((sum, g) => sum + g.missions, 0),
      treatedArea,
      appliedVolume,
      density: treatedArea > 0 ? appliedVolume / treatedArea : null
    };
  });
}
