import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {Crop} from '../domain/model/crop.entity';
import {FieldManagementApi} from '../infrastructure/field-management-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

/**
 * Holds crop application state and coordinates crop application layer behavior.
 */
@Injectable({
    providedIn: 'root'
})
export class CropStore {
    private readonly fieldManagementApi = inject(FieldManagementApi);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of crops.
     */
    readonly cropCount = computed(() => this.crops().length);

    private readonly cropsSignal = signal<Crop[]>([]);

    /**
     * Readonly signal for the list of crops.
     */
    readonly crops = this.cropsSignal.asReadonly();

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
     * Creates an instance of CropStore and loads initial data.
     */
    constructor() {
        this.loadCrops();
    }

    /**
     * Selects a crop by identifier.
     * @param id - Crop identifier.
     * @returns Reactive selection for the requested crop.
     */
    getCropById = (id: number): Signal<Crop | undefined> =>
        computed(() => id ? this.crops().find(c => c.id === id) : undefined);

    /**
     * Adds a new crop.
     * @param crop - The crop to add.
     */
    addCrop = (crop: Crop): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.createCrop(crop).pipe(retry(2)).subscribe({
            next: createdCrop => {
                this.cropsSignal.update(crops => [...crops, createdCrop]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create crop'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Updates an existing crop.
     * @param updatedCrop - The crop to update.
     */
    updateCrop = (updatedCrop: Crop): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.updateCrop(updatedCrop).pipe(retry(2)).subscribe({
            next: crop => {
                this.cropsSignal.update(crops =>
                    crops.map(c => c.id === crop.id ? crop : c)
                );
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to update crop'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Deletes a crop by ID.
     * @param id - The ID of the crop to delete.
     */
    deleteCrop = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.deleteCrop(id).pipe(retry(2)).subscribe({
            next: () => {
                this.cropsSignal.update(crops => crops.filter(c => c.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete crop'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all crops from the API.
     */
    reloadCrops = (): void => {
        this.loadCrops();
    };

    /**
     * Loads all crops from the API.
     */
    private loadCrops = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.fieldManagementApi.getAllCrops().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: crops => {
                this.cropsSignal.set(crops);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load crops'));
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
