import {ChangeDetectionStrategy, Component, input, InputSignal, output} from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import {Crop} from "../../../domain/model/crop.entity";



@Component({
  imports: [MatCardModule, MatButtonModule, MatIcon, TranslatePipe],
  selector: "app-crop-item",
  styleUrl: "./crop-item.css",
  templateUrl: "./crop-item.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropItem {
  crop: InputSignal<Crop> = input.required<Crop>();

  edit = output<number>();

  delete = output<number>();
}