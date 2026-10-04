import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CropStore} from '../../../application/crop.store';
import {Crop} from '../../../domain/model/crop.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Creates and edits crop entities.
 */
@Component({
  selector: 'app-crop-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
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
   * Creates an instance of CropForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.cropId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.cropId;
      if (this.isEdit && this.cropId) {
        const id = this.cropId;
        const crop = this.store.getCropById(id)();
        if (crop) {
          this.form.patchValue({ name: crop.name, variety: crop.variety });
        }
      }
    });
  }

  /**
   * Submits the form to create or update the crop.
   */
  submit() {
    if (this.form.invalid) return;

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