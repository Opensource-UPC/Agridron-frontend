import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FarmStore} from '../../../application/farm.store';
import {FarmList} from '../farm-list/farm-list';


@Component({
  imports: [FarmList],
  selector: "app-farm-page",
  templateUrl: './farm-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FarmPage {
  private readonly farmStore = inject(FarmStore);

  readonly farms = this.farmStore.farms;

  readonly loading = this.farmStore.loading;

  readonly error = this.farmStore.error;
}