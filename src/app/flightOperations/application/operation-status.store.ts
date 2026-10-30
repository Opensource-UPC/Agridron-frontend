import {computed, DestroyRef, inject, Injectable, Signal, signal} from "@angular/core";
import {FlightOperationsApi} from "../infrastructure/flight-operations-api";
import {OperationStatus} from "../domain/model/operation-status.entity";

@Injectable({
    providedIn: 'root'
})
export class OperationStatusStore {
    private readonly flightOperationsApi = inject(FlightOperationsApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of Operations Statuses
     */
    readonly OperationStatusCount = computed(() => this.operationStatuses.length);

    private readonly missionResultsSignal = signal<OperationStatus[]>([]);

    /**
     * Readonly signal for the list of Operations Statuses
     */
    readonly operationStatuses = this.missionResultsSignal.asReadonly();

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
     * Creates an instance of OperationStatusStore
     */
    constructor() {
        this.loadOperationStatuses();
    }

    /**
     * Selects an Operation Status by identifier
     * @param id - Operation Status identifier
     * @returns Reactive selection for the requested Operation Status
     */
    getOperationStatusById = (id: number): Signal<OperationStatus | undefined> =>
        computed(() => id ? this.operationStatuses().find(i => i.id === id) : undefined);

    /**
     * Adds a new Operation Status
     * @param operationStatus - The Operation Status to add
     */
    addOperationStatus = (operationStatus: OperationStatus): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.createOperationStatus(operationStatus).subscribe({
            next: createdOperationStatus => {
                this.missionResultsSignal.update(operationStatuses => [...operationStatuses, createdOperationStatus]);
            }
        })
    };

    /**
     * Updates an existing Operation Status
     * @param updatedOperationStatus - The Operation Status to update
     */
    updateOperationStatus = (updatedOperationStatus: OperationStatus): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.updateOperationStatus(updatedOperationStatus).subscribe({
            next: updatedOperationStatus => {
                this.missionResultsSignal.update(operationStatuses => operationStatuses.map(i => i.id === updatedOperationStatus.id ? updatedOperationStatus : i));
            }
        })
    };

    /**
     * Deletes an Operation Status by ID
     * @param id - The ID of the Operation Status to delete
     */
    deleteOperationStatus = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.deleteOperationStatus(id).subscribe({
            next: () => {
                this.missionResultsSignal.update(operationStatuses => operationStatuses.filter(i => i.id !== id));
            }
        })
    };

    /**
     * Reloads all Operations Statuses from the API
     */
    reloadOperationStatuses = (): void => {
        this.loadOperationStatuses();
    }

    /**
     * Loads all Operations Statuses from the API
     */
    private loadOperationStatuses = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.flightOperationsApi.getAllOperationStatuses().subscribe({
            next: (operationStatuses) => {
                this.missionResultsSignal.set(operationStatuses);
                this.loadingSignal.set(false);
            },
            error: (error) => {
                this.errorSignal.set(this.formatError(error, 'Error loading operation statuses'));
                this.loadingSignal.set(false);
            }
        });
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