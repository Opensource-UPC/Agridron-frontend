import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {Farm} from "../../../domain/model/farm.entity";
import {FarmItem} from '../farm-item/farm-item';


@Component({
  imports: [FarmItem, MatGridListModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: "app-farm-list",
  styleUrl: "./farm-list.css",
  templateUrl: "./farm-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FarmList {
  farms: InputSignal<Farm[]> = input.required<Farm[]>();

  loading: InputSignal<boolean> = input(false);

  error: InputSignal<string | null> = input<string | null>(null);
}