/**
 * Holds mission application state and coordinates mission-related actions.
 */

import {computed, DestroyRef, inject, Injectable, Signal, signal} from "@angular/core";
import {FlightOperationsApi} from "../infrastructure/flight-operations-api";
import {Mission} from "../domain/model/mission.entity";

@Injectable({
    providedIn: 'root'
})
export class MissionStore {
    private readonly flightOperationsApi = inject(FlightOperationsApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of missions
     */
    readonly missionCount = computed(() => this.missions.length);

    private readonly missionsSignal = signal<Mission[]>([]);

    /**
     * Readonly signal for the list of missions
     */
    readonly missions = this.missionsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);

    /**
     * Readonly signal indicating if data is loading
     */
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);

    /**
     * Readonly signal for the current error message
     */
    readonly error = this.errorSignal.asReadonly();

    /**
     * Creates an instance of MissionStore and loads initial data
     */
    constructor() {
        this.loadMissions();
    }

    /**
     * Select a Mission by identifier
     * @param Id - Mission identifier
     * @returns Reactive selection for the requested Mission
     */
    getMissionById = (id: number): Signal<Mission | undefined> =>
        computed(() => id ? this.missions().find(m => m.id === id) : undefined);

    /**
     * Adds a new mission
     * @param mission - The mission to add
     */
    addMission = (mission: Mission): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.createMission(mission).subscribe({
            next: createdMission => {
                this.missionsSignal.update(missions => [...missions, createdMission]);
            }
        })
    };

    /**
     * Updates an existing mission
     * @param updatedMission - The mission to update
     */
    updateMission = (updatedMission: Mission): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.updateMission(updatedMission).subscribe({
            next: updatedMission => {
                this.missionsSignal.update(missions => missions.map(m => m.id === updatedMission.id ? updatedMission : m));
            }
        })
    };

    /**
     * Deletes a mission by ID
     * @param id - The ID of the mission to delete
     */
    deleteMission = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.deleteMission(id).subscribe({
            next: () => {
                this.missionsSignal.update(missions => missions.filter(m => m.id !== id));
            }
        })
    };

    /**
     * Reloads all missions from the API
     */
    reloadMissions = (): void => {
        this.loadMissions();
    }

    /**
     * Loads all missions from the API
     */
    private loadMissions = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.getAllMissions().subscribe({
            next: missions => {
                this.missionsSignal.set(missions);
                this.loadingSignal.set(false);
            }
        })
    };

    /**
     * Normalizes unknown errors into a display-friendly message
     * @param error - The error to normalize
     * @param fallback - The fallback message if the error is not recognized
     * @returns A normalized error message
     */
    private formatError = (error: unknown, fallback: string): string => {
        if (error instanceof Error) {
            return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
        }
        return fallback;
    }
}