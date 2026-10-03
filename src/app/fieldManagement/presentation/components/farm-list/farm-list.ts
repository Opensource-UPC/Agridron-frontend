import {ChangeDetectionStrategy, Component, inject, input, InputSignal} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {Farm} from "../../../domain/model/farm.entity";
import {FarmItem} from '../farm-item/farm-item';
import {FarmStore} from '../../../application/farm.store';


@Component({
  imports: [FarmItem, MatButtonModule, MatIcon, TranslatePipe],
  selector: "app-farm-list",
  styleUrl: "./farm-list.css",
  templateUrl: "./farm-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FarmList {
  private readonly router = inject(Router);
  private readonly farmStore = inject(FarmStore);
  private readonly translate = inject(TranslateService);

  farms: InputSignal<Farm[]> = input.required<Farm[]>();

  loading: InputSignal<boolean> = input(false);

  error: InputSignal<string | null> = input<string | null>(null);

  newFarm = (): void => {
    this.router.navigate(['/farms/new']).then();
  };

  editFarm = (id: number): void => {
    this.router.navigate(['/farms', id, 'edit']).then();
  };

  deleteFarm = (id: number): void => {
    if (!window.confirm(this.translate.instant('farm.delete-confirm'))) {
      return;
    }
    this.farmStore.deleteFarm(id);
  };
}