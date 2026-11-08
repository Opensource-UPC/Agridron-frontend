import {Component, effect, inject, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ParcelStore} from '../../../application/parcel.store';
import {FarmStore} from '../../../application/farm.store';
import {CropStore} from '../../../application/crop.store';
import {Parcel} from '../../../domain/model/parcel.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {PolygonMap} from '../../../../shared/presentation/components/polygon-map/polygon-map';

/**
 * Creates and edits parcel entities.
 */
@Component({
  selector: 'app-parcel-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIcon, RouterLink, DecimalPipe, ReactiveFormsModule, TranslatePipe, PolygonMap],
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
   * True when the image URL could not be loaded; shows the placeholder in the preview.
   */
  imageFailed = false;

  /**
   * Parcel being edited; drives the form once the store has loaded it.
   */
  private readonly editingId = signal<number | null>(null);

  private patched = false;

  /**
   * Creates an instance of ParcelForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.parcelId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.parcelId;
      this.patched = false;
      this.editingId.set(this.parcelId);
    });

    // Fills the form as soon as the parcel is available (also when the page is opened directly).
    effect(() => {
      const id = this.editingId();
      const parcel = id ? this.store.getParcelById(id)() : undefined;
      if (parcel && !this.patched) {
        this.patched = true;
        this.form.patchValue({
          name: parcel.name,
          area: parcel.area,
          geometry: parcel.geometry,
          farmId: parcel.farmId,
          cropId: parcel.cropId,
          image: parcel.image
        });
      }
    });
  }

  /**
   * Image URL to preview, only when it looks like a web address.
   */
  get imagePreviewUrl(): string | null {
    const url = this.form.controls.image.value?.trim();
    return url && /^https?:\/\/\S+$/i.test(url) ? url : null;
  }

  /**
   * Names shown in the live preview for the selected farm and crop.
   */
  get previewFarmName(): string | null {
    const farmId = this.form.controls.farmId.value;
    return this.farms().find(farm => farm.id === farmId)?.name ?? null;
  }

  get previewCropName(): string | null {
    const cropId = this.form.controls.cropId.value;
    return this.crops().find(crop => crop.id === cropId)?.name ?? null;
  }

  /**
   * The map gives the area in m²; parcels store it in hectares (1 ha = 10 000 m²), rounded to 2 decimals.
   */
  onAreaChange(squareMeters: number) {
    this.form.controls.area.setValue(Math.round(squareMeters / 100) / 100);
  }

  /**
   * Submits the form to create or update the parcel.
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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

    this.router.navigate(['/parcels'], { queryParams: { farmId: parcel.farmId } }).then();
  }
}
