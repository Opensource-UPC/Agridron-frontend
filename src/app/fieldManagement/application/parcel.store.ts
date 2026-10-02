import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {Parcel} from '../domain/model/parcel.entity';
import {FieldManagementApi} from '../infrastructure/field-management-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin, retry} from 'rxjs';

/**
 * Holds parcel application state and coordinates parcel application layer behavior.
 */
@Injectable({
    providedIn: 'root'
})
export class ParcelStore {
    private readonly fieldManagementApi = inject(FieldManagementApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of parcels.
     */
    readonly parcelCount = computed(() => this.parcels().length);

    private readonly parcelsSignal = signal<Parcel[]>([]);

    /**
     * Readonly signal for the list of parcels.
     */
    readonly parcels = this.parcelsSignal.asReadonly();

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
     * Creates an instance of ParcelStore and loads initial data.
     */
    constructor() {
        this.loadParcels();
    }

    /**
     * Selects a parcel by identifier.
     * @param id - Parcel identifier.
     * @returns Reactive selection for the requested parcel.
     */
    getParcelById = (id: number): Signal<Parcel | undefined> =>
        computed(() => id ? this.parcels().find(p => p.id === id) : undefined);

    /**
     * Selects the parcels belonging to a farm.
     * @param farmId - Farm identifier.
     * @returns Reactive selection with the parcels of the farm.
     */
    getParcelsByFarmId = (farmId: number): Signal<Parcel[]> =>
        computed(() => this.parcels().filter(p => p.farmId === farmId));

    /**
     * Adds a new parcel.
     * @param parcel - The parcel to add.
     */
    addParcel = (parcel: Parcel): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.createParcel(parcel).pipe(retry(2)).subscribe({
            next: createdParcel => {
                this.assignCropToParcel(createdParcel);
                this.parcelsSignal.update(parcels => [...parcels, createdParcel]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create parcel'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Updates an existing parcel.
     * @param updatedParcel - The parcel to update.
     */
    updateParcel = (updatedParcel: Parcel): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.updateParcel(updatedParcel).pipe(retry(2)).subscribe({
            next: parcel => {
                this.assignCropToParcel(parcel);
                this.parcelsSignal.update(parcels =>
                    parcels.map(p => p.id === parcel.id ? parcel : p)
                );
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to update parcel'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Deletes a parcel by ID.
     * @param id - The ID of the parcel to delete.
     */
    deleteParcel = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.deleteParcel(id).pipe(retry(2)).subscribe({
            next: () => {
                this.parcelsSignal.update(parcels => parcels.filter(p => p.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete parcel'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all parcels from the API.
     */
    reloadParcels = (): void => {
        this.loadParcels();
    };

    /**
     * Loads all parcels with their crops from the API.
     */
    private loadParcels = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        forkJoin({
            parcels: this.fieldManagementApi.getAllParcels().pipe(retry(2)),
            crops: this.fieldManagementApi.getAllCrops().pipe(retry(2))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({parcels, crops}) => {
                parcels.forEach(parcel => {
                    parcel.crop = crops.find(c => c.id === parcel.cropId) ?? null;
                });
                this.parcelsSignal.set(parcels);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load parcels'));
                this.loadingSignal.set(false);
            }
        });
    };

    private assignCropToParcel = (parcel: Parcel): void => {
        if (parcel.crop !== undefined) {
            return;
        }
        this.fieldManagementApi.getCropById(parcel.cropId).pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: crop => {
                parcel.crop = crop;
                this.parcelsSignal.update(parcels =>
                    parcels.map(p => p.id === parcel.id ? parcel : p)
                );
            },
            error: () => {
                parcel.crop = null;
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
