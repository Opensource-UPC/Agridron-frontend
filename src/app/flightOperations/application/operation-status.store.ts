/**
 - Holds Operation Status application state and coordinates status-related actions.
 */

import {computed, DestroyRef, inject, Injectable, Signal, signal} from "@angular/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {FlightOperationsApi} from "../infrastructure/flight-operations-api";
import {OperationStatus} from "../domain/model/operation-status.entity";

@Injectable({
    providedIn: 'root'
})
export class OperationStatusStore {
    private readonly flightOperationsApi = inject(FlightOperationsApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     - Computed signal for the count of Operations Statuses
     */
    readonly OperationStatusCount = computed(() => this.operationStatuses().length);

    private readonly missionResultsSignal = signal<OperationStatus[]>([]);

    /**
     - Readonly signal for the list of Operations Statuses
     */
    readonly operationStatuses = this.missionResultsSignal.asReadonly();

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
     - Creates an instance of OperationStatusStore
     */
    constructor() {
        this.loadOperationStatuses();
    }

    /**
     - Selects an Operation Status by identifier
     -
     - @param id Operation Status identifier
     -
     @returns Reactive selection for the requested Operation Status
     */
    getOperationStatusById = (id: number): Signal<OperationStatus | undefined> =>
        computed(() => id ? this.operationStatuses().find(i => i.id === id) : undefined);

    /**
     - Returns all Operation Statuses for a given mission
     -
     @param missionId
     */
    getByMissionId = (missionId: number): Signal<OperationStatus[]> =>
        computed(() => this.operationStatuses()
            .filter(s => s.missionId === missionId)
            .sort((a, b) => (a.timestamp?.getTime() ?? 0) - (b.timestamp?.getTime() ?? 0)));

    /**
     - Adds a new Operation Status
     -
     - @param operationStatus The Operation Status to add
     */
    addOperationStatus = (operationStatus: OperationStatus): void => {
        this.start();
        this.flightOperationsApi.createOperationStatus(operationStatus).pipe(retry(2)).subscribe({
            next: createdOperationStatus => {
                this.missionResultsSignal.update(operationStatuses => [...operationStatuses, createdOperationStatus]);
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to create operation status')
        });
    };

    /**
     - Updates an existing Operation Status
     -
     - @param updatedOperationStatus The Operation Status to update
     */
    updateOperationStatus = (updatedOperationStatus: OperationStatus): void => {
        this.start();
        this.flightOperationsApi.updateOperationStatus(updatedOperationStatus).pipe(retry(2)).subscribe({
            next: updatedOperationStatus => {
                this.missionResultsSignal.update(operationStatuses => operationStatuses.map(i => i.id === updatedOperationStatus.id ? updatedOperationStatus : i));
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to update operation status')
        });
    };

    /**
     - Deletes an Operation Status by ID
     -
     - @param id The ID of the Operation Status to delete
     */
    deleteOperationStatus = (id: number): void => {
        this.start();
        this.flightOperationsApi.deleteOperationStatus(id).pipe(retry(2)).subscribe({
            next: () => {
                this.missionResultsSignal.update(operationStatuses => operationStatuses.filter(i => i.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => this.fail(err, 'Failed to delete operation status')
        });
    };

    /**
     - Reloads all Operations Statuses from the API
     */
    reloadOperationStatuses = (): void => {
        this.loadOperationStatuses();
    }

    /**
     - Loads all Operations Statuses from the API
     */
    private loadOperationStatuses = (): void => {
        this.start();
        this.flightOperationsApi.getAllOperationStatuses().pipe(
            retry(2),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: (operationStatuses) => {
                this.missionResultsSignal.set(operationStatuses);
                this.loadingSignal.set(false);
            },
            error: (error) => {
                this.fail(error, 'Error loading operation statuses');
            }
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