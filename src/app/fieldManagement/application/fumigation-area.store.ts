import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {FumigationArea} from '../domain/model/fumigationArea.entity';
import {FieldManagementApi} from '../infrastructure/field-management-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

/**
 * Holds fumigation area application state and coordinates fumigation area application layer behavior.
 *
 * <p>The backend only exposes fumigation areas per parcel ({@code GET /fumigation-areas?parcelId=}),
 * so the store keeps a cache keyed by parcel and loads each parcel on demand.</p>
 */
@Injectable({
    providedIn: 'root'
})
export class FumigationAreaStore {
    private readonly fieldManagementApi = inject(FieldManagementApi);
    private readonly destroyRef = inject(DestroyRef);

    private readonly areasByParcelSignal = signal<ReadonlyMap<number, FumigationArea[]>>(new Map());

    /** Parcels whose areas were already requested, so they are not fetched twice. */
    private readonly requestedParcelIds = new Set<number>();

    /** Individual areas already requested by ID (used when editing by direct URL). */
    private readonly requestedAreaIds = new Set<number>();

    /** Number of in-flight requests, used to derive the loading flag. */
    private pendingRequests = 0;

    /**
     * Computed signal with every fumigation area currently cached.
     */
    readonly fumigationAreas = computed(() =>
        [...this.areasByParcelSignal().values()].flat());

    /**
     * Computed signal for the count of fumigation areas.
     */
    readonly fumigationAreaCount = computed(() => this.fumigationAreas().length);

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
        computed(() => this.areasByParcelSignal().get(parcelId) ?? []);

    /**
     * Loads the fumigation areas of a parcel from the API.
     * @param parcelId - Parcel identifier.
     * @param force - When true, re-fetches the parcel even if it was already loaded.
     */
    loadFumigationAreas = (parcelId: number, force = false): void => {
        if (!parcelId || (!force && this.requestedParcelIds.has(parcelId))) {
            return;
        }
        this.requestedParcelIds.add(parcelId);
        this.startRequest();
        this.fieldManagementApi.getFumigationAreasByParcel(parcelId).pipe(
            retry(2),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: fumigationAreas => {
                this.setAreasForParcel(parcelId, fumigationAreas);
                this.endRequest();
            },
            error: err => {
                this.requestedParcelIds.delete(parcelId);
                this.errorSignal.set(this.formatError(err, 'Failed to load fumigation areas'));
                this.endRequest();
            }
        });
    };

    /**
     * Loads the fumigation areas of every given parcel that is not cached yet.
     * @param parcelIds - Parcel identifiers.
     */
    loadFumigationAreasForParcels = (parcelIds: number[]): void => {
        parcelIds.forEach(parcelId => this.loadFumigationAreas(parcelId));
    };

    /**
     * Loads a single fumigation area by ID. Used when the form is opened directly by URL.
     * @param id - Fumigation area identifier.
     */
    loadFumigationAreaById = (id: number): void => {
        if (!id || this.containsArea(id) || this.requestedAreaIds.has(id)) {
            return;
        }
        this.requestedAreaIds.add(id);
        this.startRequest();
        this.fieldManagementApi.getFumigationAreaById(id).pipe(
            retry(2),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe({
            next: fumigationArea => {
                this.upsertArea(fumigationArea);
                this.endRequest();
            },
            error: err => {
                this.requestedAreaIds.delete(id);
                this.errorSignal.set(this.formatError(err, 'Failed to load fumigation area'));
                this.endRequest();
            }
        });
    };

    /**
     * Adds a new fumigation area.
     * @param fumigationArea - The fumigation area to add.
     */
    addFumigationArea = (fumigationArea: FumigationArea): void => {
        this.startRequest();
        this.fieldManagementApi.createFumigationArea(fumigationArea).pipe(retry(2)).subscribe({
            next: createdFumigationArea => {
                this.upsertArea(createdFumigationArea);
                this.endRequest();
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create fumigation area'));
                this.endRequest();
            }
        });
    };

    /**
     * Updates an existing fumigation area.
     * @param updatedFumigationArea - The fumigation area to update.
     */
    updateFumigationArea = (updatedFumigationArea: FumigationArea): void => {
        this.startRequest();
        this.fieldManagementApi.updateFumigationArea(updatedFumigationArea).pipe(retry(2)).subscribe({
            next: fumigationArea => {
                this.removeArea(fumigationArea.id);
                this.upsertArea(fumigationArea);
                this.endRequest();
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to update fumigation area'));
                this.endRequest();
            }
        });
    };

    /**
     * Deletes a fumigation area by ID.
     * @param id - The ID of the fumigation area to delete.
     */
    deleteFumigationArea = (id: number): void => {
        this.startRequest();
        this.fieldManagementApi.deleteFumigationArea(id).pipe(retry(2)).subscribe({
            next: () => {
                this.removeArea(id);
                this.endRequest();
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete fumigation area'));
                this.endRequest();
            }
        });
    };

    /**
     * Reloads the fumigation areas of a parcel from the API.
     * @param parcelId - Parcel identifier.
     */
    reloadFumigationAreas = (parcelId: number): void => {
        this.requestedParcelIds.delete(parcelId);
        this.loadFumigationAreas(parcelId);
    };

    private containsArea = (id: number): boolean =>
        this.fumigationAreas().some(area => area.id === id);

    private setAreasForParcel = (parcelId: number, fumigationAreas: FumigationArea[]): void => {
        const updated = new Map(this.areasByParcelSignal());
        updated.set(parcelId, fumigationAreas);
        this.areasByParcelSignal.set(updated);
    };

    private upsertArea = (fumigationArea: FumigationArea): void => {
        const current = this.areasByParcelSignal();
        const parcelAreas = current.get(fumigationArea.parcelId) ?? [];
        const updated = new Map(current);
        updated.set(fumigationArea.parcelId, [
            ...parcelAreas.filter(area => area.id !== fumigationArea.id),
            fumigationArea
        ]);
        this.areasByParcelSignal.set(updated);
        this.requestedAreaIds.delete(fumigationArea.id);
    };

    private removeArea = (id: number): void => {
        const updated = new Map<number, FumigationArea[]>();
        this.areasByParcelSignal().forEach((areas, parcelId) =>
            updated.set(parcelId, areas.filter(area => area.id !== id)));
        this.areasByParcelSignal.set(updated);
        this.requestedAreaIds.delete(id);
    };

    private startRequest = (): void => {
        this.pendingRequests += 1;
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
    };

    private endRequest = (): void => {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1);
        this.loadingSignal.set(this.pendingRequests > 0);
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
