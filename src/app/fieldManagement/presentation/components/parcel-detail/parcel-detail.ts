import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {ParcelStore} from '../../../application/parcel.store';

/**
 * Shows the detail view of a single parcel, including its geometry map.
 */
@Component({
  selector: 'app-parcel-detail',
  imports: [MatButtonModule, TranslatePipe],
  templateUrl: './parcel-detail.html',
  styleUrl: './parcel-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParcelDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly parcelStore = inject(ParcelStore);

  readonly parcelId: number | null = this.route.snapshot.paramMap.get('id')
    ? +this.route.snapshot.paramMap.get('id')!
    : null;

  readonly parcel = this.parcelId ? this.parcelStore.getParcelById(this.parcelId)() : undefined;

  back = (): void => {
    this.router.navigate(['/parcels']).then();
  };
}