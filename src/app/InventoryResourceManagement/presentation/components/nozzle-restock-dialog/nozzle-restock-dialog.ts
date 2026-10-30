import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {Nozzle} from '../../../domain/model/nozzle.entity';
import {NozzleTypeLabel} from '../nozzle-type-label/nozzle-type-label';

const integer = (control: AbstractControl): ValidationErrors | null =>
    Number.isInteger(control.value) ? null : {integer: true};

/**
 * Diálogo "Reponer stock": suma unidades BUENAS a una boquilla existente.
 * Devuelve la cantidad de unidades a agregar.
 */
@Component({
  selector: 'app-nozzle-restock-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, NozzleTypeLabel, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule],
  templateUrl: './nozzle-restock-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-info { margin: 0 0 8px; color: #334155; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NozzleRestockDialog {
  private readonly fb = inject(FormBuilder);
  protected readonly nozzle = inject<Nozzle>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<NozzleRestockDialog, number>>(MatDialogRef);

  protected readonly form = this.fb.nonNullable.group({
    units: [1, [Validators.required, Validators.min(1), Validators.max(1000), integer]]
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.getRawValue().units);
  }
}