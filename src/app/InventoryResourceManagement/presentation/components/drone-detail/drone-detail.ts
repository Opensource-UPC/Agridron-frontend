
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DroneStore} from '../../../application/dron-store';

@Component({
  selector: 'app-drone-detail',
  imports: [
    DatePipe,
    TranslatePipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './drone-detail.html',
  styleUrl: './drone-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DroneDetail {
  private readonly store = inject(DroneStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly droneId = Number(
      this.route.snapshot.paramMap.get('id')
  );

  readonly drone = this.store.getDroneById(this.droneId);

  readonly nozzle = computed(() => {
    const selectedDrone = this.drone();

    return selectedDrone
        ? this.store.nozzles().find(
            n => n.id === selectedDrone.nozzleId
        )
        : undefined;
  });

  readonly loading = this.store.loading;
  readonly error = this.store.error;

  goBack(): void {
    this.router.navigate(['/drones']);
  }
}
