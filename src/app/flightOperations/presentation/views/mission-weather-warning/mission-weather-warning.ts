import {Component, computed, effect, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {WeatherService} from '../../../../weather-integration/application/weather-service';
import {WeatherCondition} from '../../../../weather-integration/domain/model/weather-condition.entity';
import {MissionWeatherMetrics} from '../../components/mission-weather-metrics/mission-weather-metrics';
import {blockingAlerts} from '../../mission.weather';

/**
 * Shows the current weather before take-off and lets the user reschedule or continue.
 */
@Component({
    selector: 'app-mission-weather-warning',
    imports: [MatButtonModule, MatIcon, TranslatePipe, MissionWeatherMetrics],
    templateUrl: './mission-weather-warning.html',
    styleUrl: './mission-weather-warning.css'
})
export class MissionWeatherWarning {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly parcelStore = inject(ParcelStore);
    private readonly farmStore = inject(FarmStore);
    private readonly weatherService = inject(WeatherService);

    readonly missionId = Number(this.route.snapshot.paramMap.get('id'));
    readonly store = inject(MissionStore);
    readonly mission = this.store.getMissionById(this.missionId);

    readonly parcel = computed(() => this.parcelStore.parcels().find(p => p.id === this.mission()?.parcelId));
    readonly farm = computed(() => this.farmStore.farms().find(f => f.id === this.parcel()?.farmId));

    /**
     * Weather at the center of the mission parcel; undefined while loading or if the service fails.
     */
    readonly condition = signal<WeatherCondition | undefined>(undefined);

    /** True until the weather service answers. */
    readonly loading = signal(true);

    /** High alerts that explain why the mission was stopped (CL-002). */
    readonly highAlerts = computed(() => {
        const condition = this.condition();
        return condition ? blockingAlerts(condition) : [];
    });

    /**
     * Creates an instance of MissionWeatherWarning and requests the weather of the parcel.
     */
    constructor() {
        // The parcel comes from a store, so the request waits until it is available.
        effect(() => {
            const parcel = this.parcel();
            if (!parcel) return;
            const {latitude, longitude} = parcel.centroid();
            this.weatherService.getWeatherAt(latitude, longitude, parcel.name).subscribe({
                next: condition => {
                    this.condition.set(condition);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        });
    }

    /**
     * Opens the edit form to change the mission date.
     */
    reschedule() {
        this.router.navigate(['flight-operations/missions', this.missionId, 'edit']).then();
    }

    /**
     * Opens the home view, where the weather widget lives.
     */
    forecast() {
        this.router.navigate(['home']).then();
    }

    /**
     * Starts the mission despite the warning.
     */
    continueAnyway() {
        const mission = this.mission();
        if (!mission) return;
        this.store.startMission(mission);
        this.router.navigate(['flight-operations/missions', this.missionId]).then();
    }
}