import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {WeatherService} from '../../../../weather-integration/application/weather-service';
import {MissionWeatherMetrics} from '../../components/mission-weather-metrics/mission-weather-metrics';

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
     * Weather condition of the farm location, or the first available one.
     */
    readonly condition = computed(() => {
        const conditions = this.weatherService.weatherConditions();
        const location = this.farm()?.location.toLowerCase() ?? '';
        return conditions.find(c => location.includes(c.location.toLowerCase())) ?? conditions[0];
    });

    /**
     * Creates an instance of MissionWeatherWarning and loads the weather data.
     */
    constructor() {
        this.weatherService.loadWeatherConditions();
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