import {ChangeDetectionStrategy, Component, computed, input, InputSignal, output, signal} from "@angular/core";
import {DecimalPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {Farm} from "../../../domain/model/farm.entity";


@Component({
  imports: [MatCardModule, MatButtonModule, MatIcon, RouterLink, DecimalPipe, TranslatePipe],
  selector: "app-farm-item",
  styleUrl: "./farm-item.css",
  templateUrl: "./farm-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FarmItem {
  farm: InputSignal<Farm> = input.required<Farm>();

  edit = output<number>();

  delete = output<number>();

  /** True when the farm image could not be loaded; the placeholder is shown instead. */
  readonly imageFailed = signal(false);

  /** Total area of the farm, as the sum of its parcels (ha). */
  readonly totalArea = computed(() => this.farm().parcel.reduce((sum, parcel) => sum + (parcel.area ?? 0), 0));
}
