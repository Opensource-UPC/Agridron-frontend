/**
 *  Holds incident application state and coordinates incident application layer behavior
 */
import {computed, DestroyRef, inject, Injectable, Signal, signal} from "@angular/core";
import {FlightOperationsApi} from "../infrastructure/flight-operations-api";
import {Incident} from "../domain/model/incident.entity";

@Injectable({
    providedIn: 'root'
})
export class IncidentStore {
    private readonly flightOperationsApi = inject(FlightOperationsApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of incidents
     */
    readonly incidentCount = computed(() => this.incidents().length);

    private readonly incidentsSignal = signal<Incident[]>([]);

    /**
     * Readonly signal for the list of incidents
     */
    readonly incidents = this.incidentsSignal.asReadonly();

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
     * Creates an instance of IncidentStore and loads initial data
     */
    constructor() {
        this.loadIncidents();
    }

    /**
     * Selects an incident by identifier
     * @param id - Incident identifier
     * @returns Reactive selection for the requested incident
     */
    getIncidentById = (id: number): Signal<Incident | undefined> =>
        computed(() => id ? this.incidents().find(i => i.id === id) : undefined);

    /**
     * Adds a new incident
     * @param incident - The incident to add
     */
    addIncident = (incident: Incident): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.createIncident(incident).subscribe({
            next: createdIncident => {
                this.incidentsSignal.update(incidents => [...incidents, createdIncident]);
            }
        });
    };

    /**
     * Updates an existing incident
     * @param updatedIncident - The incident to update
     */
    updateIncident = (updatedIncident: Incident): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.updateIncident(updatedIncident).subscribe({
            next: updatedIncident => {
                this.incidentsSignal.update(incidents => incidents.map(i => i.id === updatedIncident.id ? updatedIncident : i));
            }
        });
    };

    /**
     * Deletes an incident by ID
     * @param id - The ID of the incident to delete
     */
    deleteIncident = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.deleteIncident(id).subscribe({
            next: () => {
                this.incidentsSignal.update(incidents => incidents.filter(i => i.id !== id));
            }
        })
    }

    /**
     * Reloads all incidents from the API
     */
    reloadIncidents = (): void => {
        this.loadIncidents();
    }

    /**
     * Loads all incidents from the API
     */
    private loadIncidents = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.getAllIncidents().subscribe({
            next: incidents => {
                this.incidentsSignal.set(incidents);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            }
        })
    }

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