

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {AGROCHEMICAL_TYPES, Agrochemicals} from '../../../domain/model/agrochemical.entity';

/** Lo que devuelve el diálogo al confirmar. */
export interface AgrochemicalCreateResult {
  name: string;
  type: string;
  activeIngredient: string;
  recommendedDoseLitersPerHa: number;
  stockLiters: number;
  minimumStockLiters: number;
  expirationDate: string;
}

/** Fecha de hoy como AAAA-MM-DD, en hora local. */
export const todayString = (): string => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

/** Un texto compuesto solo por espacios cuenta como vacío. */
const notBlank = (control: AbstractControl): ValidationErrors | null =>
    String(control.value ?? '').trim() ? null : {required: true};

/** La fecha de vencimiento no puede ser anterior a hoy. */
const notExpired = (control: AbstractControl): ValidationErrors | null =>
    control.value && control.value < todayString() ? {expired: true} : null;

/** Normaliza para comparar nombres sin importar mayúsculas ni espacios sobrantes. */
const normalize = (text: string): string => text.trim().toLowerCase();

/**
 * Diálogo "Nuevo agroquímico" (DR-003).
 * Sin ingrediente activo o sin dosis recomendada el producto no se habilita:
 * el botón queda desactivado y cada campo indica qué dato falta.
 */
@Component({
  selector: 'app-agrochemical-create-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './agrochemical-create-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-error { color: #b42318; margin: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgrochemicalCreateDialog {
  private readonly fb = inject(FormBuilder);
  private readonly existing = inject<Agrochemicals[]>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<AgrochemicalCreateDialog, AgrochemicalCreateResult>>(MatDialogRef);

  protected readonly types = AGROCHEMICAL_TYPES;
  protected readonly today = todayString();

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [notBlank, Validators.maxLength(60)]],
    type: ['', Validators.required],
    activeIngredient: ['', [notBlank, Validators.maxLength(60)]],
    recommendedDoseLitersPerHa: [0, [Validators.required, Validators.min(0.01), Validators.max(100)]],
    stockLiters: [0, [Validators.required, Validators.min(0)]],
    minimumStockLiters: [0, [Validators.required, Validators.min(0)]],
    expirationDate: ['', [Validators.required, notExpired]]
  }, {
    // La denominación comercial no puede repetirse en el catálogo.
    validators: (group: AbstractControl): ValidationErrors | null => {
      const name = String(group.get('name')?.value ?? '');
      const duplicated = !!name.trim() &&
          this.existing.some(a => normalize(a.name) === normalize(name));
      return duplicated ? {duplicate: true} : null;
    }
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.ref.close({
      name: value.name.trim(),
      type: value.type,
      activeIngredient: value.activeIngredient.trim(),
      recommendedDoseLitersPerHa: Number(value.recommendedDoseLitersPerHa),
      stockLiters: Number(value.stockLiters),
      minimumStockLiters: Number(value.minimumStockLiters),
      expirationDate: value.expirationDate
    });
  }
}