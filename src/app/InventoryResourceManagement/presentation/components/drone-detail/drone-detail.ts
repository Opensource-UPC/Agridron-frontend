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
import {NozzleTypeLabel} from '../nozzle-type-label/nozzle-type-label';
import {
  NozzleChangeData,
  NozzleChangeDialog,
  NozzleChangeResult
} from '../nozzle-change-dialog/nozzle-change-dialog';

@Component({
  selector: 'app-drone-detail',
  imports: [
    DatePipe,
    TranslatePipe,
    NozzleTypeLabel,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './drone-detail.html',
  styleUrl: './drone-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DroneDetail {
  private readonly store = inject(DroneStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly droneId = Number(
      this.route.snapshot.paramMap.get('id')
  );

  readonly drone = this.store.getDroneById(this.droneId);

  readonly nozzle = computed(() => {
    const selectedDrone = this.drone();

    return selectedDrone
        ? this.store.nozzles().find(
            n => n.id === selectedDrone.nozzleId
        )
        : undefined;
  });

  /** Un dron en vuelo no puede cambiar de boquilla. */
  readonly canChangeNozzle = computed(() => this.drone()?.status !== 'in-flight');

  readonly loading = this.store.loading;
  readonly error = this.store.error;

  goBack(): void {
    this.router.navigate(['/drones']);
  }

  editDrone() :void{
    this.router.navigate(['/drones', this.droneId , 'edit']);
  }

  /** Cambiar boquilla: abre el diálogo y, al confirmar, actualiza dron y stock. */
  changeNozzle(): void {
    const drone = this.drone();
    if (!drone) return;

    this.dialog
        .open<NozzleChangeDialog, NozzleChangeData, NozzleChangeResult>(NozzleChangeDialog, {
          data: {drone, current: this.nozzle(), nozzles: this.store.nozzles()},
          width: '460px'
        })
        .afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          if (!result) return;
          this.store
              .changeDroneNozzle(drone, result.nozzleId, result.retiredState)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({error: () => {}});
        });
  }

}