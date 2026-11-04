import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

/** Un texto compuesto solo por espacios cuenta como vacío. */
const notBlank = (control: AbstractControl): ValidationErrors | null =>
    String(control.value ?? '').trim() ? null : {required: true};

/**
 * Diálogo "Reportar falla" (DR-006): pide la descripción de la falla.
 * Devuelve el texto al confirmar.
 */
@Component({
  selector: 'app-incident-report-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule],
  templateUrl: './incident-report-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-hint { margin: 0 0 8px; color: #475569; font-size: 13px; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentReportDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject<MatDialogRef<IncidentReportDialog, string>>(MatDialogRef);

  protected readonly form = this.fb.nonNullable.group({
    description: ['', [notBlank, Validators.maxLength(200)]]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.getRawValue().description.trim());
  }
}