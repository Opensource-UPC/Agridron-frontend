import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FarmStore} from '../../../application/farm.store';
import {ParcelStore} from '../../../application/parcel.store';
import {ParcelItem} from '../parcel-item/parcel-item';


@Component({
  imports: [ParcelItem, MatButtonModule, MatIcon, MatSelectModule, MatFormFieldModule, TranslatePipe],
  selector: "app-parcel-list",
  styleUrl: "./parcel-list.css",
  templateUrl: "./parcel-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParcelList {
  private readonly router = inject(Router);
  private readonly farmStore = inject(FarmStore);
  private readonly parcelStore = inject(ParcelStore);
  private readonly translate = inject(TranslateService);

  readonly farms = this.farmStore.farms;

  readonly selectedFarmId = signal<number | null>(null);

  readonly parcels = computed(() => {
    const farmId = this.selectedFarmId();
    return farmId ? this.parcelStore.getParcelsByFarmId(farmId)() : [];
  });

  readonly loading = computed(() => this.farmStore.loading() || this.parcelStore.loading());

  readonly error = computed(() => this.farmStore.error() ?? this.parcelStore.error());

  readonly emptyMessage = computed(() => {
    if (this.loading()) {
      return this.translate.instant('parcel.loading');
    }
    return this.selectedFarmId() ? this.translate.instant('parcel.empty') : this.translate.instant('parcel.selectFarmPrompt');
  });

  onFarmSelected = (farmId: number | null): void => {
    this.selectedFarmId.set(farmId);
  };

  newParcel = (): void => {
    this.router.navigate(['/parcels/new']).then();
  };

  editParcel = (id: number): void => {
    this.router.navigate(['/parcels', id, 'edit']).then();
  };

  seeMoreParcel = (id: number): void => {
    this.router.navigate(['/parcels', id]).then();
  };

  deleteParcel = (id: number): void => {
    if (!window.confirm(this.translate.instant('parcel.delete-confirm'))) {
      return;
    }
    this.parcelStore.deleteParcel(id);
  };
}