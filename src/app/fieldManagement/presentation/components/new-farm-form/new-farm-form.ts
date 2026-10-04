import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FarmStore} from '../../../application/farm.store';
import {Farm} from '../../../domain/model/farm.entity';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Creates and edits farm entities.
 */
@Component({
  selector: 'app-new-farm-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './new-farm-form.html',
  styleUrl: './new-farm-form.css'
})
export class NewFarmForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(FarmStore);

  /**
   * Form group for the farm form.
   */
  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    location: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    ownerId: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
    image: new FormControl<string | null>(null)
  });

  /**
   * Indicates if the form is in edit mode.
   */
  isEdit = false;

  /**
   * The ID of the farm being edited, or null for new farms.
   */
  farmId: number | null = null;

  /**
   * Creates an instance of NewFarmForm and initializes the form based on route parameters.
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.farmId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.farmId;
      if (this.isEdit && this.farmId) {
        const id = this.farmId;
        const farm = this.store.getFarmById(id)();
        if (farm) {
          this.form.patchValue({ name: farm.name, location: farm.location, ownerId: farm.ownerId, image: farm.image });
        }
      }
    });
  }

  /**
   * Submits the form to create or update the farm.
   */
  submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const existing = this.isEdit && this.farmId ? this.store.getFarmById(this.farmId)() : undefined;
    const farm = new Farm(
      this.farmId ?? 0,
      value.name,
      value.location,
      value.ownerId,
      existing?.parcel ?? [],
      value.image
    );

    if (this.isEdit) {
      this.store.updateFarm(farm);
    } else {
      this.store.addFarm(farm);
    }

    this.router.navigate(['/farms']).then();
  }
}