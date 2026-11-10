import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {Drone} from '../../../domain/model/drone.entity';
import {MAINTENANCE_TYPES} from '../../../domain/model/maintance-records.entity';

/** Lo que devuelve el diálogo al confirmar. */
export interface MaintenanceRegisterResult {
  date: string;
  type: string;
  description: string;
  technician: string;
  /** Solo en mantenimientos preventivos; en correctivos es null. */
  nextMaintenanceDate: string | null;
}

/** Fecha de hoy como AAAA-MM-DD, en hora local. */
const today = (): string => new Date().toLocaleDateString('en-CA');

/** Pasa AAAA-MM-DD a DD/MM/AAAA para mostrarla en un mensaje. */
const formatDate = (iso: string): string => iso.split('-').reverse().join('/');

/** Un texto compuesto solo por espacios cuenta como vacío. */
const notBlank = (control: AbstractControl): ValidationErrors | null =>
    String(control.value ?? '').trim() ? null : {required: true};

/** Un mantenimiento ya realizado no puede tener fecha futura. */
const notInFuture = (control: AbstractControl): ValidationErrors | null =>
    control.value && control.value > today() ? {future: true} : null;

const isPreventive = (control: AbstractControl): boolean =>
    control.parent?.get('type')?.value === 'preventive';

/**
 * Diálogo "Registrar mantenimiento" (DR-005).
 * Un mantenimiento preventivo pide además la fecha del próximo servicio, porque al
 * guardarse actualiza las fechas del dron y reinicia sus horas de vuelo.
 */
@Component({
  selector: 'app-maintenance-register-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './maintenance-register-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-hint { margin: 0 0 8px; color: #475569; font-size: 13px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceRegisterDialog {
  private readonly fb = inject(FormBuilder);
  private readonly drone = inject<Drone>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<MaintenanceRegisterDialog, MaintenanceRegisterResult>>(MatDialogRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly types = MAINTENANCE_TYPES;
  protected readonly today = today();
  /** Último servicio del dron, ya formateado para el mensaje de error. */
  protected readonly lastServiceText = this.drone.lastMaintenanceDate
      ? formatDate(this.drone.lastMaintenanceDate) : '';

  /** Un preventivo no puede ser anterior al último servicio del dron. */
  private readonly notBeforeLastService = (control: AbstractControl): ValidationErrors | null => {
    const last = this.drone.lastMaintenanceDate;
    return isPreventive(control) && last && control.value && control.value < last
        ? {beforeLast: true} : null;
  };

  /** La fecha del próximo servicio solo se pide en preventivos. */
  private readonly nextRequired = (control: AbstractControl): ValidationErrors | null =>
      isPreventive(control) && !control.value ? {required: true} : null;

  /** El próximo servicio debe ser posterior a la fecha del mantenimiento. */
  private readonly nextAfterDate = (control: AbstractControl): ValidationErrors | null => {
    const date = control.parent?.get('date')?.value;
    return isPreventive(control) && control.value && date && control.value <= date
        ? {beforeDate: true} : null;
  };

  protected readonly form = this.fb.nonNullable.group({
    date: [today(), [Validators.required, notInFuture, this.notBeforeLastService]],
    type: ['preventive', Validators.required],
    description: ['', [notBlank, Validators.maxLength(200)]],
    technician: ['', [notBlank, Validators.maxLength(60)]],
    nextMaintenanceDate: ['', [this.nextRequired, this.nextAfterDate]]
  });

  constructor() {
    // Al cambiar el tipo o la fecha, se vuelven a validar los campos que dependen de ellos.
    this.form.controls.type.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.form.controls.date.updateValueAndValidity();
          this.form.controls.nextMaintenanceDate.updateValueAndValidity();
        });
    this.form.controls.date.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.form.controls.nextMaintenanceDate.updateValueAndValidity());
  }

  /** ¿Es preventivo? La plantilla lo usa para pedir el próximo servicio. */
  protected get preventive(): boolean {
    return this.form.controls.type.value === 'preventive';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.ref.close({
      date: value.date,
      type: value.type,
      description: value.description.trim(),
      technician: value.technician.trim(),
      nextMaintenanceDate: this.preventive ? value.nextMaintenanceDate : null
    });
  }
}