import {ChangeDetectionStrategy, Component, input, InputSignal, output} from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {Parcel} from "../../../domain/model/parcel.entity";



@Component({
  imports: [MatCardModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: "app-parcel-item",
  styleUrl: "./parcel-item.css",
  templateUrl: "./parcel-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParcelItem {
  parcel: InputSignal<Parcel> = input.required<Parcel>();

  seeMore = output<number>();

  edit = output<number>();

  delete = output<number>();
}