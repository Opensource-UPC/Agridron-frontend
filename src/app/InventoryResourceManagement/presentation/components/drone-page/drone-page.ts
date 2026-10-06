import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import {TranslatePipe} from '@ngx-translate/core';
import {DroneStore} from "../../../application/dron-store";
import {DroneList} from "../dron-list/dron-list"

@Component({
  selector: 'app-drone-page',
  imports: [DroneList, TranslatePipe],
  templateUrl: './drone-page.html',
  styleUrl: './drone-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 *
 */
export class DronePage {

  private readonly store = inject(DroneStore);

  // Señales de solo lectura del store (se leen con paréntesis en el HTML)
  protected readonly drones = this.store.drones;
  protected readonly nozzles = this.store.nozzles;
  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;

  // Por ahora solo reciben el clic. Luego aquí se navega al detalle o a los mantenimientos.
  protected readonly onViewDetails = (id: number): void => {};
  protected readonly onViewMaintenance = (id: number): void => {};

}
