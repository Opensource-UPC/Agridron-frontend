import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {DroneIncident} from '../../../domain/model/drone-incident.entity';
import {todayIso} from '../../../domain/model/local-date';

/** Lo que devuelve el diálogo al confirmar. */
export interface IncidentRepairResult {
  date: string;
  description: string;
  technician: string;
}

/** Pasa AAAA-MM-DD a DD/MM/AAAA para mostrarla en un mensaje. */
const formatDate = (iso: string): string => iso.split('-').reverse().join('/');

/** Un texto compuesto solo por espacios cuenta como vacío. */
const notBlank = (control: AbstractControl): ValidationErrors | null =>
    String(control.value ?? '').trim() ? null : {required: true};

/** Una reparación ya realizada no puede tener fecha futura. */
const notInFuture = (control: AbstractControl): ValidationErrors | null =>
    control.value && control.value > todayIso() ? {future: true} : null;

/**
 * Diálogo "Registrar reparación" (DR-006): fecha, qué se reparó y técnico.
 * Recibe el incidente pendiente para impedir una fecha anterior a la del reporte.
 */
@Component({
  selector: 'app-incident-repair-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule],
  templateUrl: './incident-repair-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-hint { margin: 0 0 8px; color: #475569; font-size: 13px; }
    .dialog-fault { margin: 0 0 8px; padding: 8px 12px; border-radius: 8px; background: #FEF3C7; color: #92400E; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentRepairDialog {
  private readonly fb = inject(FormBuilder);
  protected readonly incident = inject<DroneIncident>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<IncidentRepairDialog, IncidentRepairResult>>(MatDialogRef);

  protected readonly today = todayIso();
  protected readonly reportedText = formatDate(this.incident.reportedAt);

  /** La reparación no puede ser anterior a la fecha en que se reportó la falla. */
  private readonly notBeforeReport = (control: AbstractControl): ValidationErrors | null =>
      control.value && control.value < this.incident.reportedAt ? {beforeReport: true} : null;

  protected readonly form = this.fb.nonNullable.group({
    date: [todayIso(), [Validators.required, notInFuture, this.notBeforeReport]],
    description: ['', [notBlank, Validators.maxLength(200)]],
    technician: ['', [notBlank, Validators.maxLength(60)]]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.ref.close({
      date: value.date,
      description: value.description.trim(),
      technician: value.technician.trim()
    });
  }
}