import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';

import {DroneStore} from '../../../application/dron-store';
import {Drone} from '../../../domain/model/drone.entity';

// La fecha del siguiente mantenimiento no puede ser anterior
// a la fecha del último mantenimiento.
function validateMaintenanceDates(
    control: AbstractControl
): ValidationErrors | null {
  const last = control.get('lastMaintenanceDate')?.value;
  const next = control.get('nextMaintenanceDate')?.value;

  return last && next && next < last
      ? {invalidMaintenanceDates: true}
      : null;
}

@Component({
  selector: 'app-drone-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './drone-form.html',
  styleUrl: './drone-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DroneForm {

  private readonly fb = inject(FormBuilder);
  private readonly store = inject(DroneStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly droneId = Number(
      this.route.snapshot.paramMap.get('id')
  );

  readonly drone = this.store.getDroneById(this.droneId);
  readonly nozzles = this.store.nozzles;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  readonly statuses = [
    {value: 'available'},
    {value: 'in-flight'},
    {value: 'maintenance'},
    {value: 'out-of-service'}
  ];

  readonly form = this.fb.nonNullable.group({
    serialNumber: ['', Validators.required],
    model: ['', Validators.required],
    batteryLevel: [0, [
      Validators.required,
      Validators.min(0),
      Validators.max(100)
    ]],
    status: ['available', Validators.required],
    nozzleId: [0, [
      Validators.required,
      Validators.min(1)
    ]],
    lastMaintenanceDate: ['', Validators.required],
    nextMaintenanceDate: ['', Validators.required],
    urlimg: [''],
    tankCapacityLiters: [0, [
      Validators.required,
      Validators.min(1),
      Validators.max(100)
    ]]
  }, {
    validators: validateMaintenanceDates
  });

  private initialized = false;

  constructor() {
    effect(() => {
      const selectedDrone = this.drone();

      if (selectedDrone && !this.initialized) {
        this.form.patchValue({
          serialNumber: selectedDrone.serialNumber,
          model: selectedDrone.model,
          batteryLevel: selectedDrone.batteryLevel,
          status: selectedDrone.status,
          nozzleId: selectedDrone.nozzleId,
          tankCapacityLiters: selectedDrone.tankCapacityLiters ?? 0,
          lastMaintenanceDate: selectedDrone.lastMaintenanceDate,
          nextMaintenanceDate: selectedDrone.nextMaintenanceDate,
          urlimg: selectedDrone.urlimg,
        });

        this.initialized = true;
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const original = this.drone();
    if (!original || this.loading()) return;

    const value = this.form.getRawValue();

    const updatedDrone = new Drone(
        original.id,
        value.serialNumber.trim(),
        value.model.trim(),
        value.batteryLevel,
        value.status,
        value.nozzleId,
        value.tankCapacityLiters,
        value.lastMaintenanceDate,
        value.nextMaintenanceDate,
        value.urlimg.trim(),
    );

    this.store.updateDrone(updatedDrone)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            void this.router.navigate(['/drones', original.id]);
          },
          error: () => {
            // El store guarda el error y lo muestra la plantilla.
          }
        });
  }

  cancel(): void {
    void this.router.navigate(['/drones', this.droneId]);
  }
}