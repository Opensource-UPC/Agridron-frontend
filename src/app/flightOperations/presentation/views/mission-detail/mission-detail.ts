import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {OperationStatusStore} from '../../../application/operation-status.store';
import {MissionStatus} from '../../../domain/model/mission-status.enum';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {DroneStore} from '../../../../InventoryResourceManagement/application/dron-store';
import {MissionStatusBadge} from '../../components/mission-status-badge/mission-status-badge';
import {MissionStepper} from '../../components/mission-stepper/mission-stepper';
import {MissionTelemetry} from '../../components/mission-telemetry/mission-telemetry';
import {injectNow} from "../../mission.time";

/**
 * Shows the monitoring view of a mission with its lifecycle actions.
 */
@Component({
    selector: 'app-mission-detail',
    imports: [
        MatCardModule,
        MatButtonModule,
        TranslatePipe,
        MissionStatusBadge,
        MissionStepper,
        MissionTelemetry
    ],
    templateUrl: './mission-detail.html',
    styleUrl: './mission-detail.css'
})
export class MissionDetail {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly parcelStore = inject(ParcelStore);
    private readonly farmStore = inject(FarmStore);
    private readonly droneStore = inject(DroneStore);
    private readonly now = injectNow();

    readonly missionId = Number(this.route.snapshot.paramMap.get('id'));
    readonly store = inject(MissionStore);
    readonly mission = this.store.getMissionById(this.missionId);
    readonly timeline = inject(OperationStatusStore).getByMissionId(this.missionId);

    protected readonly MissionStatus = MissionStatus;

    readonly parcel = computed(() => this.parcelStore.parcels().find(p => p.id === this.mission()?.parcelId));
    readonly farm = computed(() => this.farmStore.farms().find(f => f.id === this.parcel()?.farmId));
    readonly drone = computed(() => this.droneStore.drones().find(d => d.id === this.mission()?.droneId));
    readonly lastPosition = computed(() => this.timeline().at(-1));

    /**
     * Index of the current step, derived from the mission status.
     */
    readonly stepIndex = computed(() => {
        switch (this.mission()?.status) {
            case MissionStatus.AUTHORIZED: return 1;
            case MissionStatus.IN_PROGRESS:
            case MissionStatus.PAUSED: return 2;
            case MissionStatus.COMPLETED: return 3;
            default: return 0;
        }
    });

    /**
     * Elapsed time since the first recorded operation status.
     */
    readonly elapsedMs = computed(() => {
        const entries = this.timeline();
        if (!entries.length) return 0;
        const start = entries[0].timestamp?.getTime() ?? 0;
        const end = this.mission()?.status === MissionStatus.IN_PROGRESS
            ? this.now()
            : (entries[entries.length - 1].timestamp?.getTime() ?? start);
        return end - start;
    });

    /**
     * Authorizes the mission.
     */
    authorize() {
        const mission = this.mission();
        if (mission) this.store.authorizeMission(mission);
    }

    /**
     * Opens the weather warning before starting the mission.
     */
    start() {
        this.navigateTo('weather-warning');
    }

    /**
     * Pauses the mission and opens the pause view.
     */
    pause() {
        const mission = this.mission();
        if (!mission) return;
        this.store.pauseMission(mission);
        this.navigateTo('paused');
    }

    /**
     * Resumes a paused mission.
     */
    resume() {
        const mission = this.mission();
        if (mission) this.store.resumeMission(mission);
    }

    /**
     * Completes the mission and opens the summary.
     */
    finish() {
        const mission = this.mission();
        if (!mission) return;
        this.store.completeMission(mission);
        this.navigateTo('complete');
    }

    /**
     * Opens the incident form.
     */
    incident() {
        this.navigateTo('incident');
    }

    /**
     * Opens the pause view.
     */
    viewPaused() {
        this.navigateTo('paused');
    }

    /**
     * Opens the completion summary.
     */
    viewSummary() {
        this.navigateTo('complete');
    }

    /**
     * Goes back to the mission list.
     */
    back() {
        this.router.navigate(['flight-operations/missions']).then();
    }

    private navigateTo(path: string) {
        this.router.navigate(['flight-operations/missions', this.missionId, path]).then();
    }
}