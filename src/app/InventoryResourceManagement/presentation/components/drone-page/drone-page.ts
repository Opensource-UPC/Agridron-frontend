import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import {TranslatePipe} from '@ngx-translate/core';
import {DroneStore} from "../../../application/dron-store";
import {DroneList} from "../dron-list/dron-list"
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-drone-page',
  imports: [
      DroneList,
    TranslatePipe,
      MatButtonModule,
      MatIconModule,
  ],
  templateUrl: './drone-page.html',
  styleUrl: 'drone-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 *
 */
export class DronePage {

  private readonly store = inject(DroneStore);
  private readonly router = inject(Router);

  // Señales de solo lectura del store (se leen con paréntesis en el HTML)
  protected readonly drones = this.store.drones;
  protected readonly nozzles = this.store.nozzles;
  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;

  // Por ahora solo reciben el clic. Luego aquí se navega al detalle o a los mantenimientos.
  protected readonly onViewDetails = (id: number): void =>
  {
      this.router.navigateByUrl(`/drones/${id}`);
  };
  protected readonly onViewMaintenance = (id: number): void =>
  {
   this.router.navigateByUrl(`/drones/${id}/maintenance`);

  };

  protected readonly onNewDrone = (): void =>{
    this.router.navigateByUrl(`/drones/new`);
  }
  protected readonly onViewNozzles = (): void => {
    this.router.navigateByUrl('/drones/nozzles');
  };
}
