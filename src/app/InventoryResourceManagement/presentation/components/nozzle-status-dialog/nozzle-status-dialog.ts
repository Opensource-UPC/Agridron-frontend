import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {NOZZLE_STATES, Nozzle, NozzleState} from '../../../domain/model/nozzle.entity';
import {NozzleTypeLabel} from '../nozzle-type-label/nozzle-type-label';

/** Lo que devuelve el diálogo al confirmar. */
export interface NozzleStatusChange {
  from: NozzleState;
  to: NozzleState;
  quantity: number;
}

const integer = (control: AbstractControl): ValidationErrors | null =>
    Number.isInteger(control.value) ? null : {integer: true};

/**
 * Diálogo "Actualizar estado": pasa unidades de un estado a otro
 * (por ejemplo, 2 buenas a desgastadas). El total no cambia.
 */
@Component({
  selector: 'app-nozzle-status-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, NozzleTypeLabel, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './nozzle-status-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-info { margin: 0 0 8px; color: #334155; }
    .dialog-error { color: #b42318; margin: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NozzleStatusDialog {
  private readonly fb = inject(FormBuilder);
  protected readonly nozzle = inject<Nozzle>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<NozzleStatusDialog, NozzleStatusChange>>(MatDialogRef);

  protected readonly states = NOZZLE_STATES;

  // Por defecto: de un estado que tenga unidades hacia otro distinto.
  private readonly defaultFrom: NozzleState =
      NOZZLE_STATES.find(s => this.nozzle.unitsIn(s) > 0) ?? 'good';
  private readonly defaultTo: NozzleState =
      NOZZLE_STATES.find(s => s !== this.defaultFrom) ?? 'worn';

  protected readonly form = this.fb.nonNullable.group({
    from: [this.defaultFrom as NozzleState],
    to: [this.defaultTo as NozzleState],
    quantity: [1, [Validators.required, Validators.min(1), integer]]
  }, {
    validators: (group: AbstractControl): ValidationErrors | null => {
      const {from, to, quantity} = group.getRawValue();
      if (from === to) return {sameState: true};
      if (quantity > this.nozzle.unitsIn(from)) return {exceeds: true};
      return null;
    }
  });

  private readonly from = toSignal(this.form.controls.from.valueChanges,
      {initialValue: this.form.controls.from.value});

  /** Unidades disponibles en el estado de origen elegido. */
  protected readonly available = computed(() => this.nozzle.unitsIn(this.from()));

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.ref.close(this.form.getRawValue());
  }
}