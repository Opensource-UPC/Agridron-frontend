import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {Farm} from '../domain/model/farm.entity';
import {FieldManagementApi} from '../infrastructure/field-management-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin, retry} from 'rxjs';

/**
 * Holds farm application state and coordinates farm application layer behavior.
 */
@Injectable({
    providedIn: 'root'
})
export class FarmStore {
    private readonly fieldManagementApi = inject(FieldManagementApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of farms.
     */
    readonly farmCount = computed(() => this.farms().length);

    private readonly farmsSignal = signal<Farm[]>([]);

    /**
     * Readonly signal for the list of farms.
     */
    readonly farms = this.farmsSignal.asReadonly();

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
     * Creates an instance of FarmStore and loads initial data.
     */
    constructor() {
        this.loadFarms();
    }

    /**
     * Selects a farm by identifier.
     * @param id - Farm identifier.
     * @returns Reactive selection for the requested farm.
     */
    getFarmById = (id: number): Signal<Farm | undefined> =>
        computed(() => id ? this.farms().find(f => f.id === id) : undefined);

    /**
     * Selects the parcels belonging to a farm.
     * @param farmId - Farm identifier.
     * @returns Reactive selection with the parcels of the farm.
     */
    getParcelsByFarmId = (farmId: number): Signal<Farm['parcel']> =>
        computed(() => this.farms().find(f => f.id === farmId)?.parcel ?? []);

    /**
     * Adds a new farm.
     * @param farm - The farm to add.
     */
    addFarm = (farm: Farm): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.createFarm(farm).pipe(retry(2)).subscribe({
            next: createdFarm => {
                this.assignParcelsToFarm(createdFarm);
                this.farmsSignal.update(farms => [...farms, createdFarm]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create farm'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Updates an existing farm.
     * @param updatedFarm - The farm to update.
     */
    updateFarm = (updatedFarm: Farm): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.updateFarm(updatedFarm).pipe(retry(2)).subscribe({
            next: farm => {
                this.assignParcelsToFarm(farm);
                this.farmsSignal.update(farms =>
                    farms.map(f => f.id === farm.id ? farm : f)
                );
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to update farm'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Deletes a farm by ID.
     * @param id - The ID of the farm to delete.
     */
    deleteFarm = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.deleteFarm(id).pipe(retry(2)).subscribe({
            next: () => {
                this.farmsSignal.update(farms => farms.filter(f => f.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete farm'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all farms from the API.
     */
    reloadFarms = (): void => {
        this.loadFarms();
    };

    /**
     * Loads all farms with their parcels from the API.
     */
    private loadFarms = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        forkJoin({
            farms: this.fieldManagementApi.getAllFarms().pipe(retry(2)),
            parcels: this.fieldManagementApi.getAllParcels().pipe(retry(2))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({farms, parcels}) => {
                farms.forEach(farm => {
                    farm.parcel = parcels.filter(p => p.farmId === farm.id);
                });
                this.farmsSignal.set(farms);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load farms'));
                this.loadingSignal.set(false);
            }
        });
    };

    private assignParcelsToFarm = (farm: Farm): void => {
        const parcels = this.farms().find(f => f.id === farm.id)?.parcel ?? farm.parcel ?? [];
        farm.parcel = parcels;
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
