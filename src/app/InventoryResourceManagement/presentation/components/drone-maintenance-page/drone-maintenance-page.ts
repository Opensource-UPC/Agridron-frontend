import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DroneStore} from '../../../application/dron-store';
import {MaintenanceRecordStore} from '../../../application/maintenance-record.store';

/**
 * Pantalla "Ver mantenimientos": historial de mantenimiento de un dron (DR-005).
 * Ruta: /drones/:id/maintenance
 */
@Component({
  selector: 'app-maintenance-page',
  imports: [DatePipe, TranslatePipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './drone-maintenance-page.html',
  styleUrl: './drone-maintenance-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenancePage {
  private readonly droneStore = inject(DroneStore);
  private readonly recordStore = inject(MaintenanceRecordStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly droneId = Number(this.route.snapshot.paramMap.get('id'));

  readonly drone = this.droneStore.getDroneById(this.droneId);
  private readonly droneRecords = this.recordStore.getRecordsByDroneId(this.droneId);

  /** Registros del dron, del más reciente al más antiguo. */
  readonly records = computed(() =>
      [...this.droneRecords()].sort((a, b) => b.date.localeCompare(a.date)));

  readonly loading = this.recordStore.loading;
  readonly error = this.recordStore.error;

  goBack(): void {
    void this.router.navigate(['/drones']);
  }

  viewDrone(): void {
    void this.router.navigate(['/drones', this.droneId]);
  }
}