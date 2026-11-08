import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {ParcelStore} from '../../../application/parcel.store';
import {FarmStore} from '../../../application/farm.store';
import {PolygonMap} from '../../../../shared/presentation/components/polygon-map/polygon-map';

/**
 * Shows the detail view of a single parcel.
 */
@Component({
  selector: 'app-parcel-detail',
  imports: [MatButtonModule, MatIcon, RouterLink, DecimalPipe, TranslatePipe, PolygonMap],
  templateUrl: './parcel-detail.html',
  styleUrl: './parcel-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParcelDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly parcelStore = inject(ParcelStore);
  private readonly farmStore = inject(FarmStore);

  readonly parcelId: number | null = this.route.snapshot.paramMap.get('id')
    ? +this.route.snapshot.paramMap.get('id')!
    : null;

  /**
   * Reactive selection, so the parcel appears once the store finishes loading
   * (e.g. when the page is opened directly or reloaded).
   */
  readonly parcel = this.parcelId ? this.parcelStore.getParcelById(this.parcelId) : signal(undefined);

  readonly loading = this.parcelStore.loading;

  readonly farmName = computed(() => {
    const parcel = this.parcel();
    return parcel ? this.farmStore.getFarmById(parcel.farmId)()?.name ?? null : null;
  });

  /** True when the parcel image could not be loaded; the placeholder is shown instead. */
  readonly imageFailed = signal(false);

  /** Vertices of the parcel polygon (GeoJSON), without the closing point. */
  readonly vertices = computed<[number, number][]>(() => {
    const geometry = this.parcel()?.geometry;
    if (!geometry) return [];
    try {
      const ring: [number, number][] = JSON.parse(geometry)?.coordinates?.[0] ?? [];
      const closed = ring.length > 1 && ring[0][0] === ring.at(-1)![0] && ring[0][1] === ring.at(-1)![1];
      return closed ? ring.slice(0, -1) : ring;
    } catch {
      return [];
    }
  });

  back = (): void => {
    this.router.navigate(['/parcels']).then();
  };
}
