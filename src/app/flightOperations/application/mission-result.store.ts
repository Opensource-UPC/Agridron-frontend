/**
 - Holds mission result application state and coordinates mission result-related actions.
 */

import {computed, DestroyRef, inject, Injectable, Signal, signal} from "@angular/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {FlightOperationsApi} from "../infrastructure/flight-operations-api";
import {MissionResult} from "../domain/model/mission-result.entity";

@Injectable({
    providedIn: 'root'
})
export class MissionResultStore {
    private readonly flightOperationsApi = inject(FlightOperationsApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     - Computed signal for the count of mission results
     */
    readonly missionResultCount = computed(() => this.missionResults().length);

    private readonly missionResultsSignal = signal<MissionResult[]>([]);

    /**
     - Readonly signal for the list of mission results
     */
    readonly missionResults = this.missionResultsSignal.asReadonly();

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
     - Creates an instance of MissionResultStore and loads initial data
     */
    constructor() {
        this.loadMissionResults();
    }

    /**
     - Select a MissionResult by identifier
     -
     - @param id MissionResult identifier
     -
     @returns Reactive selection for the requested MissionResult
     */
    getMissionResultById = (id: number): Signal<MissionResult | undefined> =>
        computed(() => id ? this.missionResults().find(m => m.id === id) : undefined);

    /**
     - Returns a MissionResult for a given mission
     -
     - @param missionId Mission identifier
     -
     @returns Reactive selection for the requested MissionResult
     */
    getByMissionId = (missionId: number): Signal<MissionResult | undefined> =>
        computed(() => this.missionResults().find(r => r.missionId === missionId));

    /**
     - Adds a new mission result
     -
     - @param missionResult The mission result to add
     */
    addMissionResult = (missionResult: MissionResult): void => {
        this.start();
        this.flightOperationsApi.createMissionResult(missionResult).pipe(retry(2)).subscribe({
            next: createdMissionResult => {
                this.missionResultsSignal.update(missionResults => [...missionResults, createdMissionResult]);
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to create mission result')
        });
    }

    /**
     - Updates an existing mission result
     -
     - @param updatedMissionResult The mission result to update
     */
    updateMissionResult = (updatedMissionResult: MissionResult): void => {
        this.start();
        this.flightOperationsApi.updateMissionResult(updatedMissionResult).pipe(retry(2)).subscribe({
            next: updatedMissionResult => {
                this.missionResultsSignal.update(missionResults => missionResults.map(m => m.id === updatedMissionResult.id ? updatedMissionResult : m));
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to update mission result')
        });
    }

    /**
     - Deletes a mission result by ID
     -
     - @param id The ID of the mission result to delete
     */
    deleteMissionResult = (id: number): void => {
        this.start();
        this.flightOperationsApi.deleteMissionResult(id).pipe(retry(2)).subscribe({
            next: () => {
                this.missionResultsSignal.update(missionResults => missionResults.filter(m => m.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to delete mission result')
        });
    }

    /**
     - Reloads all mission results from the API
     */
    reloadMissionResults = (): void => {
        this.loadMissionResults();
    }

    /**
     - Loads all mission results from the API
     */
    private loadMissionResults = (): void => {
        this.start();
        this.flightOperationsApi.getAllMissionResults().pipe(
            retry(2),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: missionResults => {
                this.missionResultsSignal.set(missionResults);
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to load mission results')
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
        this.errorSignal.set(this.formatError(error, fallback));
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