import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FarmStore} from '../../../application/farm.store';
import {ParcelStore} from '../../../application/parcel.store';
import {CropStore} from '../../../application/crop.store';
import {ParcelItem} from '../parcel-item/parcel-item';
import {ConfirmDialogService} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog.service';

/**
 * Area ranges offered by the surface filter (FM-005), in hectares.
 */
type SurfaceRange = 'all' | 'small' | 'medium' | 'large';

const SURFACE_RANGES: Record<Exclude<SurfaceRange, 'all'>, (area: number) => boolean> = {
  small: area => area < 5,
  medium: area => area >= 5 && area <= 10,
  large: area => area > 10
};


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
  private readonly cropStore = inject(CropStore);
  private readonly translate = inject(TranslateService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly farms = this.farmStore.farms;

  readonly crops = this.cropStore.crops;

  readonly surfaceRanges: Exclude<SurfaceRange, 'all'>[] = ['small', 'medium', 'large'];

  /**
   * Selected farm filter; preselected from the `farmId` query param (e.g. "See more" on a farm card).
   */
  readonly selectedFarmId = signal<number | null>(
    Number(inject(ActivatedRoute).snapshot.queryParamMap.get('farmId')) || null
  );

  /** Crop filter (FM-005); 'all' shows every crop. */
  readonly selectedCropId = signal<number | 'all'>('all');

  /** Surface filter (FM-005). */
  readonly selectedSurface = signal<SurfaceRange>('all');

  /** Parcels of the selected farm, before the crop / surface filters. */
  readonly farmParcels = computed(() => {
    const farmId = this.selectedFarmId();
    return farmId ? this.parcelStore.getParcelsByFarmId(farmId)() : [];
  });

  readonly parcels = computed(() => {
    const cropId = this.selectedCropId();
    const surface = this.selectedSurface();
    return this.farmParcels().filter(parcel =>
      (cropId === 'all' || parcel.cropId === cropId) &&
      (surface === 'all' || SURFACE_RANGES[surface](parcel.area))
    );
  });

  readonly hasActiveFilters = computed(() => this.selectedCropId() !== 'all' || this.selectedSurface() !== 'all');

  readonly loading = computed(() => this.farmStore.loading() || this.parcelStore.loading());

  readonly error = computed(() => this.farmStore.error() ?? this.parcelStore.error());

  /** Farm names by id, to show the farm name on each parcel card. */
  private readonly farmNames = computed(() => new Map(this.farms().map(farm => [farm.id, farm.name])));

  farmName = (farmId: number): string | null => this.farmNames().get(farmId) ?? null;

  onFarmSelected = (farmId: number | null): void => {
    this.selectedFarmId.set(farmId);
  };

  clearFilters = (): void => {
    this.selectedCropId.set('all');
    this.selectedSurface.set('all');
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
    this.confirmDialog.confirm({
      title: this.translate.instant('parcel.deleteTitle'),
      message: this.translate.instant('parcel.delete-confirm'),
      confirmLabel: this.translate.instant('parcel.button.delete'),
      cancelLabel: this.translate.instant('parcel.form.cancel')
    }).subscribe(confirmed => {
      if (confirmed) {
        this.parcelStore.deleteParcel(id);
      }
    });
  };
}
