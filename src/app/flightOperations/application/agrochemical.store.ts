import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {retry} from 'rxjs';
import {AgrochemicalsApiEndpoint} from "../../InventoryResourceManagement/infrastructure/agrochemicals-api-endpoint";
import {Agrochemicals} from "../../InventoryResourceManagement/domain/model/agrochemical.entity";


/**
 * Holds agrochemical application state and coordinates agrochemical application layer behavior.
 */
@Injectable({
    providedIn: 'root'
})
export class AgrochemicalStore {
    private readonly http = inject(HttpClient);
    private readonly agrochemicalEndpoint = new AgrochemicalsApiEndpoint(this.http);
    private readonly destroyRef = inject(DestroyRef);

    /**
     * Computed signal for the count of agrochemicals.
     */
    readonly agrochemicalCount = computed(() => this.agrochemicals().length);

    private readonly agrochemicalsSignal = signal<Agrochemicals[]>([]);

    /**
     * Readonly signal for the list of agrochemicals.
     */
    readonly agrochemicals = this.agrochemicalsSignal.asReadonly();

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
     * Creates an instance of AgrochemicalStore and loads initial data.
     */
    constructor() {
        this.loadAgrochemicals();
    }

    /**
     * Selects an agrochemical by identifier.
     * @param id - Agrochemical identifier.
     * @returns Reactive selection for the requested agrochemical.
     */
    getAgrochemicalById = (id: number): Signal<Agrochemicals | undefined> =>
        computed(() => id ? this.agrochemicals().find(a => a.id === id) : undefined);

    /**
     * Adds a new agrochemical.
     * @param agrochemical - The agrochemical to add.
     */
    addAgrochemical = (agrochemical: Agrochemicals): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.agrochemicalEndpoint.create(agrochemical).pipe(retry(2)).subscribe({
            next: created => {
                this.agrochemicalsSignal.update(list => [...list, created]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create agrochemical'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Updates an existing agrochemical.
     * @param updated - The agrochemical to update.
     */
    updateAgrochemical = (updated: Agrochemicals): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.agrochemicalEndpoint.update(updated, updated.id).pipe(retry(2)).subscribe({
            next: agrochemical => {
                this.agrochemicalsSignal.update(list =>
                    list.map(a => a.id === agrochemical.id ? agrochemical : a)
                );
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to update agrochemical'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Deletes an agrochemical by ID.
     * @param id - The ID of the agrochemical to delete.
     */
    deleteAgrochemical = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.agrochemicalEndpoint.delete(id).pipe(retry(2)).subscribe({
            next: () => {
                this.agrochemicalsSignal.update(list => list.filter(a => a.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete agrochemical'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all agrochemicals from the API.
     */
    reloadAgrochemicals = (): void => {
        this.loadAgrochemicals();
    };

    /**
     * Loads all agrochemicals from the API.
     */
    private loadAgrochemicals = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.agrochemicalEndpoint.getAll().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: agrochemicals => {
                this.agrochemicalsSignal.set(agrochemicals);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load agrochemicals'));
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