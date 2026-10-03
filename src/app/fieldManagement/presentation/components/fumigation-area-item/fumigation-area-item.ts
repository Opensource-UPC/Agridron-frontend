import {ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, output} from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {FumigationArea} from "../../../domain/model/fumigationArea.entity";
import {ParcelStore} from '../../../application/parcel.store';



@Component({
  imports: [MatCardModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: "app-fumigation-area-item",
  styleUrl: "./fumigation-area-item.css",
  templateUrl: "./fumigation-area-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FumigationAreaItem {
  private readonly parcelStore = inject(ParcelStore);

  fumigationArea: InputSignal<FumigationArea> = input.required<FumigationArea>();

  edit = output<number>();

  delete = output<number>();

  readonly parcelName = computed(() => {
    const parcel = this.parcelStore.getParcelById(this.fumigationArea().parcelId)();
    return parcel?.name ?? null;
  });

  private readonly maxArea = 100;

  readonly areaPercentage = computed(() => {
    const area = this.fumigationArea().area;
    if (area <= 0) return 0;
    return Math.min(100, Math.round((area / this.maxArea) * 100));
  });
}