import {Component, computed, inject, input, InputSignal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';

/**
 * Displays the farm and parcel where a mission takes place.
 */
@Component({
    selector: 'app-mission-place',
    imports: [TranslatePipe, DecimalPipe],
    templateUrl: './mission-place.html',
    styleUrl: './mission-place.css'
})
export class MissionPlace {
    private readonly parcelStore = inject(ParcelStore);
    private readonly farmStore = inject(FarmStore);

    /**
     * Identifier of the parcel of the mission.
     */
    parcelId: InputSignal<number | undefined> = input.required<number | undefined>();

    /**
     * Indicates if the center coordinates of the parcel are shown.
     */
    showCoordinates: InputSignal<boolean> = input(false);

    readonly parcel = computed(() => this.parcelStore.parcels().find(p => p.id === this.parcelId()));

    readonly farm = computed(() => this.farmStore.farms().find(f => f.id === this.parcel()?.farmId));

    readonly center = computed(() => this.parcel()?.centroid());
}