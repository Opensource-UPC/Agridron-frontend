import {ChangeDetectionStrategy, Component, input, InputSignal, output, signal} from "@angular/core";
import {DecimalPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {Parcel} from "../../../domain/model/parcel.entity";


@Component({
  imports: [MatCardModule, MatButtonModule, MatIcon, DecimalPipe, TranslatePipe],
  selector: "app-parcel-item",
  styleUrl: "./parcel-item.css",
  templateUrl: "./parcel-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParcelItem {
  parcel: InputSignal<Parcel> = input.required<Parcel>();

  /** Name of the farm the parcel belongs to (shown instead of its id). */
  farmName = input<string | null>(null);

  seeMore = output<number>();

  edit = output<number>();

  delete = output<number>();

  /** True when the parcel image could not be loaded; the placeholder is shown instead. */
  readonly imageFailed = signal(false);
}
