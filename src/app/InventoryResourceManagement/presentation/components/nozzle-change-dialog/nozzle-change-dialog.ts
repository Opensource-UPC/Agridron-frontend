

import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {Drone} from '../../../domain/model/drone.entity';
import {NOZZLE_STATES, Nozzle, NozzleState} from '../../../domain/model/nozzle.entity';
import {NozzleTypeLabel} from '../nozzle-type-label/nozzle-type-label';

/** Lo que recibe el diálogo. */
export interface NozzleChangeData {
  drone: Drone;
  /** Boquilla instalada ahora (puede no existir). */
  current: Nozzle | undefined;
  /** Todo el catálogo. */
  nozzles: Nozzle[];
}

/** Lo que devuelve el diálogo al confirmar. */
export interface NozzleChangeResult {
  nozzleId: number;
  /** En qué estado vuelve a bodega la boquilla retirada; null si el dron no tenía. */
  retiredState: NozzleState | null;
}

/**
 * Diálogo "Cambiar boquilla" (DR-004, escenario 2).
 * Solo se pueden elegir boquillas con unidades instalables (buenas o desgastadas);
 * las dañadas nunca se instalan. Si el dron ya tenía una, el operador indica en qué
 * estado queda la que se retira.
 */
@Component({
  selector: 'app-nozzle-change-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, NozzleTypeLabel, MatDialogModule,
    MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './nozzle-change-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-info { margin: 0 0 8px; color: #334155; }
    .dialog-warning { color: #92400E; background: #FEF3C7; padding: 8px 12px; border-radius: 8px; margin: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NozzleChangeDialog {
  private readonly fb = inject(FormBuilder);
  protected readonly data = inject<NozzleChangeData>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<NozzleChangeDialog, NozzleChangeResult>>(MatDialogRef);

  protected readonly states = NOZZLE_STATES;

  protected readonly form = this.fb.group({
    nozzleId: this.fb.nonNullable.control(0, [Validators.required, Validators.min(1)]),
    // Solo es obligatorio si el dron tenía una boquilla que retirar.
    retiredState: this.fb.control<NozzleState | null>(null,
        this.data.current ? Validators.required : null)
  });

  private readonly selectedId = toSignal(this.form.controls.nozzleId.valueChanges,
      {initialValue: this.form.controls.nozzleId.value});

  /** Boquilla elegida en el desplegable. */
  protected readonly selected = computed(() =>
      this.data.nozzles.find(n => n.id === this.selectedId()));

  /** Si no quedan buenas, se instalará una desgastada: se avisa. */
  protected readonly wornWarning = computed(() => {
    const nozzle = this.selected();
    return !!nozzle && nozzle.goodUnits === 0 && nozzle.wornUnits > 0;
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.ref.close({
      nozzleId: value.nozzleId,
      retiredState: this.data.current ? value.retiredState : null
    });
  }
}