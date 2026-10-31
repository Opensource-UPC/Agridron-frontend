import {Component, computed, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {OperationStatusStore} from '../../../application/operation-status.store';
import {MissionPlace} from '../../components/mission-place/mission-place';
import {formatDuration, injectNow} from "../../mission.time";


/**
 * Confirmation view shown while a mission is paused.
 */
@Component({
    selector: 'app-mission-paused',
    imports: [MatCardModule, MatButtonModule, MatIcon, TranslatePipe, DatePipe, MissionPlace],
    templateUrl: './mission-paused.html',
    styleUrl: './mission-paused.css'
})
export class MissionPaused {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly now = injectNow();

    readonly missionId = Number(this.route.snapshot.paramMap.get('id'));
    readonly store = inject(MissionStore);
    readonly mission = this.store.getMissionById(this.missionId);
    readonly timeline = inject(OperationStatusStore).getByMissionId(this.missionId);

    protected readonly format = formatDuration;

    /**
     * Milliseconds elapsed since the last pause was recorded.
     */
    readonly pausedFor = computed(() => {
        const paused = this.timeline().filter(s => s.status === 'PAUSED').at(-1);
        const at = paused?.timestamp?.getTime();
        return at ? this.now() - at : 0;
    });

    /**
     * Resumes the mission and goes back to its detail.
     */
    resume() {
        const mission = this.mission();
        if (!mission) return;
        this.store.resumeMission(mission);
        this.router.navigate(['flight-operations/missions', this.missionId]).then();
    }

    /**
     * Opens the mission detail.
     */
    details() {
        this.router.navigate(['flight-operations/missions', this.missionId]).then();
    }

    /**
     * Opens the home view.
     */
    home() {
        this.router.navigate(['home']).then();
    }
}