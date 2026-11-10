import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CropStore} from '../../../application/crop.store';
import {Crop} from '../../../domain/model/crop.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Creates and edits crop entities.
 */
@Component({
  selector: 'app-crop-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIcon, RouterLink, ReactiveFormsModule, TranslatePipe],
  templateUrl: './crop-form.html',
  styleUrl: './crop-form.css'
})
export class CropForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(CropStore);

  /**
   * Form group for the crop form.
   */
  form = this.fb.group({
    name: new FormControl<string | null>(null, { validators: [Validators.required] }),
    variety: new FormControl<string | null>(null)
  });

  /**
   * Indicates if the form is in edit mode.
   */
  isEdit = false;

  /**
   * The ID of the crop being edited, or null for new crops.
   */
  cropId: number | null = null;

  /**
   * Crop being edited; drives the form once the store has loaded it.
   */
  private readonly editingId = signal<number | null>(null);

  private patched = false;

  /**
   * Creates an instance of CropForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.cropId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.cropId;
      this.patched = false;
      this.editingId.set(this.cropId);
    });

    // Fills the form as soon as the crop is available (also when the page is opened directly).
    effect(() => {
      const id = this.editingId();
      const crop = id ? this.store.getCropById(id)() : undefined;
      if (crop && !this.patched) {
        this.patched = true;
        this.form.patchValue({ name: crop.name, variety: crop.variety });
      }
    });
  }

  /**
   * Trimmed form values shown in the live preview.
   */
  get previewName(): string {
    return this.form.controls.name.value?.trim() ?? '';
  }

  get previewVariety(): string {
    return this.form.controls.variety.value?.trim() ?? '';
  }

  /**
   * Submits the form to create or update the crop.
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const crop = new Crop(this.cropId ?? 0, value.name!, value.variety);

    if (this.isEdit) {
      this.store.updateCrop(crop);
    } else {
      this.store.addCrop(crop);
    }

    this.router.navigate(['/crops']).then();
  }
}
