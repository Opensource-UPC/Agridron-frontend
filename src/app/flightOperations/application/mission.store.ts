/**
 - Holds mission application state and coordinates mission-related actions.
 */

import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {FlightOperationsApi} from '../infrastructure/flight-operations-api';
import {Mission} from '../domain/model/mission.entity';
import {MissionResult} from '../domain/model/mission-result.entity';
import {OperationStatus} from '../domain/model/operation-status.entity';
import {MissionResultStore} from './mission-result.store';
import {OperationStatusStore} from './operation-status.store';
import {ParcelStore} from '../../fieldManagement/application/parcel.store';
import {MissionStatus} from '../domain/model/mission-status.enum';
import {IncidentStore} from './incident.store';
import {MissionHistory} from '../../analyticsAndReporting/domain/model/mission-history.entity';
import {MissionReport} from '../../analyticsAndReporting/domain/model/mission-report.entity';
import {ReportType} from '../../analyticsAndReporting/domain/model/report-type.enum';
import {MissionHistoryStore} from '../../analyticsAndReporting/application/mission-history.store';
import {MissionReportStore} from '../../analyticsAndReporting/application/mission-report.store';

@Injectable({
    providedIn: 'root'
})
export class MissionStore {
    private readonly flightOperationsApi = inject(FlightOperationsApi);
    private readonly destroyRef = inject(DestroyRef);
    private readonly operationStatusStore = inject(OperationStatusStore);
    private readonly missionResultStore = inject(MissionResultStore);
    private readonly parcelStore = inject(ParcelStore);
    private readonly incidentStore = inject(IncidentStore);
    private readonly missionHistoryStore = inject(MissionHistoryStore);
    private readonly missionReportStore = inject(MissionReportStore);

    /**
     - Computed signal for the count of missions
     */
    readonly missionCount = computed(() => this.missions().length);

    private readonly missionsSignal = signal<Mission[]>([]);

    /**
     - Readonly signal for the list of missions
     */
    readonly missions = this.missionsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);

    /**
     - Readonly signal indicating if data is loading
     */
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);

    /**
     - Readonly signal for the current error message
     */
    readonly error = this.errorSignal.asReadonly();

    /**
     - Creates an instance of MissionStore and loads initial data
     */
    constructor() {
        this.loadMissions();
    }

    /**
     - Select a Mission by identifier
     -
     - @param id Mission identifier
     -
     @returns Reactive selection for the requested Mission
     */
    getMissionById = (id: number): Signal<Mission | undefined> =>
        computed(() => id ? this.missions().find(m => m.id === id) : undefined);

    /**
     - Adds a new mission
     -
     - @param mission The mission to add
     */
    addMission = (mission: Mission): void => {
        this.start();
        this.flightOperationsApi.createMission(mission).pipe(retry(2)).subscribe({
            next: createdMission => {
                this.missionsSignal.update(missions => [...missions, createdMission]);
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to create mission')
        });
    };

    /**
     - Updates an existing mission
     -
     - @param updatedMission The mission to update
     */
    updateMission = (updatedMission: Mission): void => {
        this.start();
        this.flightOperationsApi.updateMission(updatedMission).pipe(retry(2)).subscribe({
            next: updated => {
                this.missionsSignal.update(missions => missions.map(m => m.id === updated.id ? updated : m));
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to update mission')
        });
    };

    /**
     - Deletes a mission by ID
     -
     - @param id The ID of the mission to delete
     */
    deleteMission = (id: number): void => {
        this.start();
        this.flightOperationsApi.deleteMission(id).pipe(retry(2)).subscribe({
            next: () => {
                this.missionsSignal.update(missions => missions.filter(m => m.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to delete mission')
        });
    };

    /**
     * Authorizes a planned mission.
     * @param mission - The mission to authorize.
     */
    authorizeMission = (mission: Mission): void => {
        mission.authorize();
        this.updateMission(mission);
    };

    /**
     * Starts an authorized mission.
     * @param mission - The mission to start.
     */
    startMission = (mission: Mission): void => {
        mission.start();
        this.updateMission(mission);
        this.recordOperationStatus(mission, 'IN_PROGRESS');
    };

    /**
     * Pauses a mission in progress.
     * @param mission - The mission to pause.
     */
    pauseMission = (mission: Mission): void => {
        mission.pause();
        this.updateMission(mission);
        this.recordOperationStatus(mission, 'PAUSED');
    };

    /**
     * Resumes a paused mission.
     * @param mission - The mission to resume.
     */
    resumeMission = (mission: Mission): void => {
        mission.resume();
        this.updateMission(mission);
        this.recordOperationStatus(mission, 'IN_PROGRESS');
    };

    /**
     * Completes a mission in progress and registers its result, history and summary report.
     * @param mission - The mission to complete.
     */
    completeMission = (mission: Mission): void => {
        mission.complete();
        this.updateMission(mission);
        this.recordOperationStatus(mission, 'COMPLETED');

        const area = this.parcelStore.parcels().find(p => p.id === mission.parcelId)?.area ?? null;
        const volume = area !== null && mission.sprayRate !== null ? area * mission.sprayRate : null;
        const observations = this.summarizeIncidents(mission.id);
        const completedAt = new Date().toISOString();

        this.missionResultStore.addMissionResult(new MissionResult(0, mission.id, area, volume, observations));
        this.missionHistoryStore.addHistory(
            new MissionHistory(0, mission.id, MissionStatus.COMPLETED, completedAt));
        this.missionReportStore.addReport(
            new MissionReport(0, mission.id, ReportType.MISSION_SUMMARY, area ?? 0, volume ?? 0, observations, completedAt, []));
    };

    /**
     - Reloads all missions from the API
     */
    reloadMissions = (): void => {
        this.loadMissions();
    }

    /**
     - Loads all missions from the API
     */
    private loadMissions = (): void => {
        this.start();
        this.flightOperationsApi.getAllMissions().pipe(
            retry(2),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: missions => {
                this.missionsSignal.set(missions);
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to load missions')
        });
    };

    /**
     - Sets the store state to loading and clears any previous error
     */
    private start = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
    };

    /**
     - Normalizes unknown errors into a display-friendly message and stops loading
     -
     - @param error The error to normalize
     -
     - @param fallback The fallback message if the error is not recognized
     */
    private fail = (error: unknown, fallback: string): void => {
        const message = this.formatError(error, fallback);
        this.errorSignal.set(message);
        this.loadingSignal.set(false);
    };

    /**
     - Normalizes unknown errors into a display-friendly message
     -
     - @param error The error to normalize
     -
     - @param fallback The fallback message if the error is not recognized
     -
     @returns A normalized error message
     */
    private formatError = (error: unknown, fallback: string): string => {
        if (error instanceof Error) {
            return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
        }
        return fallback;
    }

    /**
     * Registers the operation status of a mission at the center of its parcel.
     * @param mission - The mission being tracked.
     * @param status - The status label to record.
     */
    private recordOperationStatus = (mission: Mission, status: string): void => {
        const parcel = this.parcelStore.parcels().find(p => p.id === mission.parcelId);
        const {latitude, longitude} = parcel?.centroid() ?? {latitude: 0, longitude: 0};
        this.operationStatusStore.addOperationStatus(
            new OperationStatus(0, mission.id, latitude, longitude, status, new Date()));
    };

    /**
     * Builds the observations of a mission from its registered incidents.
     * @param missionId - The ID of the mission.
     * @returns The incident descriptions, or a default text when there are none.
     */
    private summarizeIncidents = (missionId: number): string => {
        const descriptions = this.incidentStore.incidents()
            .filter(i => i.missionId === missionId && i.description)
            .map(i => i.description);
        return descriptions.length ? descriptions.join('; ') : 'Mission completed without incidents.';
    };
}