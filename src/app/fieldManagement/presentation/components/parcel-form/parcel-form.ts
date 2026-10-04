import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ParcelStore} from '../../../application/parcel.store';
import {FarmStore} from '../../../application/farm.store';
import {CropStore} from '../../../application/crop.store';
import {Parcel} from '../../../domain/model/parcel.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Creates and edits parcel entities.
 */
@Component({
  selector: 'app-parcel-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './parcel-form.html',
  styleUrl: './parcel-form.css'
})
export class ParcelForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(ParcelStore);
  private farmStore = inject(FarmStore);
  private cropStore = inject(CropStore);

  /**
   * Readonly signal for the list of farms available to the form.
   */
  readonly farms = this.farmStore.farms;

  /**
   * Readonly signal for the list of crops available to the form.
   */
  readonly crops = this.cropStore.crops;

  /**
   * Form group for the parcel form.
   */
  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    area: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)] }),
    geometry: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    farmId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
    cropId: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required] }),
    image: new FormControl<string | null>(null)
  });

  /**
   * Indicates if the form is in edit mode.
   */
  isEdit = false;

  /**
   * The ID of the parcel being edited, or null for new parcels.
   */
  parcelId: number | null = null;

  /**
   * Creates an instance of ParcelForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.parcelId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.parcelId;
      if (this.isEdit && this.parcelId) {
        const id = this.parcelId;
        const parcel = this.store.getParcelById(id)();
        if (parcel) {
          this.form.patchValue({
            name: parcel.name,
            area: parcel.area,
            geometry: parcel.geometry,
            farmId: parcel.farmId,
            cropId: parcel.cropId,
            image: parcel.image
          });
        }
      }
    });
  }

  /**
   * Submits the form to create or update the parcel.
   */
  submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const parcel = new Parcel(
      this.parcelId ?? 0,
      value.name,
      value.area,
      value.geometry,
      value.farmId!,
      value.cropId!,
      value.image
    );

    if (this.isEdit) {
      this.store.updateParcel(parcel);
    } else {
      this.store.addParcel(parcel);
    }

    this.router.navigate(['/parcels']).then();
  }
}