import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {FumigationArea} from '../domain/model/fumigationArea.entity';
import {FieldManagementApi} from '../infrastructure/field-management-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

/**
 * Holds fumigation area application state and coordinates fumigation area application layer behavior.
 */
@Injectable({
    providedIn: 'root'
})
export class FumigationAreaStore {
    private readonly fieldManagementApi = inject(FieldManagementApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of fumigation areas.
     */
    readonly fumigationAreaCount = computed(() => this.fumigationAreas().length);

    private readonly fumigationAreasSignal = signal<FumigationArea[]>([]);

    /**
     * Readonly signal for the list of fumigation areas.
     */
    readonly fumigationAreas = this.fumigationAreasSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);

    /**
     * Readonly signal indicating if data is loading.
     */
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);

    /**
     * Readonly signal for the current error message.
     */
    readonly error = this.errorSignal.asReadonly();

    /**
     * Creates an instance of FumigationAreaStore and loads initial data.
     */
    constructor() {
        this.loadFumigationAreas();
    }

    /**
     * Selects a fumigation area by identifier.
     * @param id - Fumigation area identifier.
     * @returns Reactive selection for the requested fumigation area.
     */
    getFumigationAreaById = (id: number): Signal<FumigationArea | undefined> =>
        computed(() => id ? this.fumigationAreas().find(a => a.id === id) : undefined);

    /**
     * Selects the fumigation areas defined for a parcel.
     * @param parcelId - Parcel identifier.
     * @returns Reactive selection with the fumigation areas of the parcel.
     */
    getFumigationAreasByParcelId = (parcelId: number): Signal<FumigationArea[]> =>
        computed(() => this.fumigationAreas().filter(a => a.parcelId === parcelId));

    /**
     * Adds a new fumigation area.
     * @param fumigationArea - The fumigation area to add.
     */
    addFumigationArea = (fumigationArea: FumigationArea): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.createFumigationArea(fumigationArea).pipe(retry(2)).subscribe({
            next: createdFumigationArea => {
                this.fumigationAreasSignal.update(areas => [...areas, createdFumigationArea]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create fumigation area'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Updates an existing fumigation area.
     * @param updatedFumigationArea - The fumigation area to update.
     */
    updateFumigationArea = (updatedFumigationArea: FumigationArea): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.updateFumigationArea(updatedFumigationArea).pipe(retry(2)).subscribe({
            next: fumigationArea => {
                this.fumigationAreasSignal.update(areas =>
                    areas.map(a => a.id === fumigationArea.id ? fumigationArea : a)
                );
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to update fumigation area'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Deletes a fumigation area by ID.
     * @param id - The ID of the fumigation area to delete.
     */
    deleteFumigationArea = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.deleteFumigationArea(id).pipe(retry(2)).subscribe({
            next: () => {
                this.fumigationAreasSignal.update(areas => areas.filter(a => a.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete fumigation area'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all fumigation areas from the API.
     */
    reloadFumigationAreas = (): void => {
        this.loadFumigationAreas();
    };

    /**
     * Loads all fumigation areas from the API.
     */
    private loadFumigationAreas = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.getAllFumigationAreas().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: fumigationAreas => {
                this.fumigationAreasSignal.set(fumigationAreas);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load fumigation areas'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Normalizes unknown errors into a display-friendly message.
     * @param error - Source error.
     * @param fallback - Default message when details are unavailable.
     * @returns Normalized message.
     */
    private formatError = (error: unknown, fallback: string): string => {
        if (error instanceof Error) {
            return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
        }
        return fallback;
    };
}
