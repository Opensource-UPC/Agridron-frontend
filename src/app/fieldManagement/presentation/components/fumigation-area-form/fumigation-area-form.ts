import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FumigationAreaStore} from '../../../application/fumigation-area.store';
import {ParcelStore} from '../../../application/parcel.store';
import {FumigationArea} from '../../../domain/model/fumigationArea.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Creates and edits fumigation area entities.
 */
@Component({
  selector: 'app-fumigation-area-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './fumigation-area-form.html',
  styleUrl: './fumigation-area-form.css'
})
export class FumigationAreaForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(FumigationAreaStore);
  private parcelStore = inject(ParcelStore);

  /**
   * Readonly signal for the list of parcels available to the form.
   */
  readonly parcels = this.parcelStore.parcels;

  /**
   * Form group for the fumigation area form.
   */
  form = this.fb.group({
    parcelId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
    geometry: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    area: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] })
  });

  /**
   * Indicates if the form is in edit mode.
   */
  isEdit = false;

  /**
   * The ID of the fumigation area being edited, or null for new ones.
   */
  fumigationAreaId: number | null = null;

  /**
   * Creates an instance of FumigationAreaForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.fumigationAreaId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.fumigationAreaId;
      if (this.isEdit && this.fumigationAreaId) {
        const id = this.fumigationAreaId;
        const fumigationArea = this.store.getFumigationAreaById(id)();
        if (fumigationArea) {
          this.form.patchValue({
            parcelId: fumigationArea.parcelId,
            geometry: fumigationArea.geometry,
            area: fumigationArea.area
          });
        }
      }
    });
  }

  /**
   * Submits the form to create or update the fumigation area.
   */
  submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const fumigationArea = new FumigationArea(
      this.fumigationAreaId ?? 0,
      value.parcelId!,
      value.geometry,
      value.area
    );

    if (this.isEdit) {
      this.store.updateFumigationArea(fumigationArea);
    } else {
      this.store.addFumigationArea(fumigationArea);
    }

    this.router.navigate(['/fumigation-areas']).then();
  }
}