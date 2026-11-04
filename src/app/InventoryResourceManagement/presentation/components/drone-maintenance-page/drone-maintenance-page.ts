import {ChangeDetectionStrategy, Component, DestroyRef, computed, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DroneStore} from '../../../application/dron-store';
import {MaintenanceRecordStore} from '../../../application/maintenance-record.store';
import {Drone} from '../../../domain/model/drone.entity';
import {MaintenanceRecord} from '../../../domain/model/maintance-records.entity';
import {
  MaintenanceRegisterDialog,
  MaintenanceRegisterResult
} from '../maintenance-register-dialog/maintenance-register-dialog';

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
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

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

  /** Registrar mantenimiento: abre el diálogo y, al confirmar, guarda el registro (DR-005). */
  openRegister(): void {
    const drone = this.drone();
    if (!drone) return;

    this.dialog
        .open<MaintenanceRegisterDialog, Drone, MaintenanceRegisterResult>(
            MaintenanceRegisterDialog, {data: drone, width: '460px'})
        .afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          if (!result) return;
          this.recordStore.registerMaintenance(
              new MaintenanceRecord(0, drone.id, result.date, result.type,
                  result.description, result.technician),
              drone,
              result.nextMaintenanceDate
          )
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({error: () => {}}); // el store guarda el error y esta pantalla lo muestra
        });
  }

  viewDrone(): void {
    void this.router.navigate(['/drones', this.droneId]);
  }
}