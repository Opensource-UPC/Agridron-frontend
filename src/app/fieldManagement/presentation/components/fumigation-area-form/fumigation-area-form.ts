import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FumigationAreaStore} from '../../../application/fumigation-area.store';
import {ParcelStore} from '../../../application/parcel.store';
import {FumigationArea} from '../../../domain/model/fumigationArea.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {PolygonMap} from '../../../../shared/presentation/components/polygon-map/polygon-map';

/**
 * Creates and edits fumigation area entities.
 */
@Component({
  selector: 'app-fumigation-area-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIcon, RouterLink, ReactiveFormsModule, TranslatePipe, PolygonMap],
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
   * Fumigation area being edited; drives the form once the store has loaded it.
   */
  private readonly editingId = signal<number | null>(null);

  private patched = false;

  /**
   * Creates an instance of FumigationAreaForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.fumigationAreaId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.fumigationAreaId;
      this.patched = false;
      this.editingId.set(this.fumigationAreaId);
      if (this.fumigationAreaId) {
        this.store.loadFumigationAreaById(this.fumigationAreaId);
      }
    });

    // Fills the form as soon as the area is available (also when the page is opened directly).
    effect(() => {
      const id = this.editingId();
      const fumigationArea = id ? this.store.getFumigationAreaById(id)() : undefined;
      if (fumigationArea && !this.patched) {
        this.patched = true;
        this.form.patchValue({
          parcelId: fumigationArea.parcelId,
          geometry: fumigationArea.geometry,
          area: fumigationArea.area
        });
      }
    });
  }

  /**
   * Outline of the selected parcel, drawn on the map as a reference for the fumigation area.
   */
  get selectedParcelGeometry(): string {
    const parcelId = this.form.controls.parcelId.value;
    return this.parcels().find(parcel => parcel.id === parcelId)?.geometry ?? '';
  }

  /**
   * Submits the form to create or update the fumigation area.
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
