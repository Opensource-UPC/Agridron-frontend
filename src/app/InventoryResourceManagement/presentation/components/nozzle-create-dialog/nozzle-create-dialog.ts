import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {NOZZLE_TYPES, Nozzle} from '../../../domain/model/nozzle.entity';

/** Lo que devuelve el diálogo al confirmar. */
export interface NozzleCreateResult {
  type: string;
  diameterMm: number;
  goodUnits: number;
}

const integer = (control: AbstractControl): ValidationErrors | null =>
    Number.isInteger(control.value) ? null : {integer: true};

/** Valor del desplegable que significa "escribir un tipo propio". */
const OTHER = '__other__';

/** Para comparar tipos sin que importen mayúsculas ni espacios sobrantes. */
const normalize = (text: string): string => text.trim().toLowerCase();

/** El nombre propio solo es obligatorio cuando se eligió "Otro". */
const customRequired = (control: AbstractControl): ValidationErrors | null => {
  const type = control.parent?.get('type')?.value;
  return type === OTHER && !String(control.value ?? '').trim() ? {required: true} : null;
};

/**
 * Diálogo "Nueva boquilla": registra un tipo nuevo en el catálogo (DR-004).
 * Recibe las boquillas existentes para impedir un mismo tipo y diámetro repetidos.
 */
@Component({
  selector: 'app-nozzle-create-dialog',
  imports: [ReactiveFormsModule, TranslatePipe, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './nozzle-create-dialog.html',
  styles: [`
    .dialog-body { display: flex; flex-direction: column; gap: 8px; min-width: 300px; }
    .dialog-error { color: #b42318; margin: 0; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NozzleCreateDialog {
  private readonly fb = inject(FormBuilder);
  private readonly existing = inject<Nozzle[]>(MAT_DIALOG_DATA);
  private readonly ref = inject<MatDialogRef<NozzleCreateDialog, NozzleCreateResult>>(MatDialogRef);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly types = NOZZLE_TYPES;
  protected readonly other = OTHER;

  protected readonly form = this.fb.nonNullable.group({
    type: ['', Validators.required],
    customType: ['', [customRequired, Validators.maxLength(40)]],
    diameterMm: [0, [Validators.required, Validators.min(0.1), Validators.max(50)]],
    goodUnits: [0, [Validators.required, Validators.min(0), integer]]
  }, {
    // Un mismo tipo con el mismo diámetro ya existe: se repone stock en vez de duplicarlo.
    validators: (group: AbstractControl): ValidationErrors | null => {
      const {diameterMm} = group.getRawValue();
      const type = this.resolvedType(group.getRawValue());
      const duplicated = !!type && this.existing.some(n =>
          normalize(n.type) === normalize(type) && n.diameterMm === Number(diameterMm));
      return duplicated ? {duplicate: true} : null;
    }
  });

  constructor() {
    // Al cambiar entre un tipo de la lista y "Otro", se vuelve a validar el nombre propio.
    this.form.controls.type.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.form.controls.customType.updateValueAndValidity());
  }

  /** El tipo final: el elegido de la lista, o el nombre escrito si se eligió "Otro". */
  private resolvedType(value: {type: string; customType: string}): string {
    return value.type === OTHER ? value.customType.trim() : value.type;
  }

  /** ¿Se eligió "Otro"? La plantilla lo usa para mostrar el campo de texto. */
  protected get isOther(): boolean {
    return this.form.controls.type.value === OTHER;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.ref.close({
      type: this.resolvedType(value),
      diameterMm: Number(value.diameterMm),
      goodUnits: value.goodUnits
    });
  }
}