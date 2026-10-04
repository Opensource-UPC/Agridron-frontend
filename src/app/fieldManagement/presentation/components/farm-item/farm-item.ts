import {ChangeDetectionStrategy, Component, input, InputSignal, output} from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {Farm} from "../../../domain/model/farm.entity";



@Component({
  imports: [MatCardModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: "app-farm-item",
  styleUrl: "./farm-item.css",
  templateUrl: "./farm-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FarmItem {
  farm: InputSignal<Farm> = input.required<Farm>();

  edit = output<number>();

  delete = output<number>();
}
