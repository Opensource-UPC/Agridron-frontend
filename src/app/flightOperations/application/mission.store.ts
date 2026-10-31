/**
 - Holds mission application state and coordinates mission-related actions.
 */

import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {FlightOperationsApi} from '../infrastructure/flight-operations-api';
import {Mission} from '../domain/model/mission.entity';

@Injectable({
    providedIn: 'root'
})
export class MissionStore {
    private readonly flightOperationsApi = inject(FlightOperationsApi);
    private readonly destroyRef = inject(DestroyRef);

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
}