import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {forkJoin, retry} from 'rxjs';
import {Drone} from '../domain/model/drone.entity';
import {Nozzle} from '../domain/model/nozzle.entity';
import {DronApiEndpoint} from '../infrastructure/dron-api-endpoint';
import {NozzleApiEndpoint} from '../infrastructure/nozzle-api-endpoint';

@Injectable({providedIn: 'root'})
export class DroneStore {
    private readonly http = inject(HttpClient);
    private readonly droneEndpoint = new DronApiEndpoint(this.http);
    private readonly nozzleEndpoint = new NozzleApiEndpoint(this.http);
    private readonly destroyRef = inject(DestroyRef);

    private readonly dronesSignal = signal<Drone[]>([]);
    readonly drones = this.dronesSignal.asReadonly();

    private readonly nozzlesSignal = signal<Nozzle[]>([]);
    readonly nozzles = this.nozzlesSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    readonly droneCount = computed(() => this.drones().length);

    constructor() {
        this.loadDrones();
    }

    getDroneById = (id: number): Signal<Drone | undefined> =>
        computed(() => id ? this.drones().find(d => d.id === id) : undefined);

    getDronesByStatus = (status: string): Signal<Drone[]> =>
        computed(() => this.drones().filter(d => d.status === status));

    getNozzleById = (id: number): Signal<Nozzle | undefined> =>
        computed(() => this.nozzles().find(n => n.id === id));

    addDrone = (drone: Drone): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.droneEndpoint.create(drone).pipe(retry(2)).subscribe({
            next: created => {
                this.dronesSignal.update(drones => [...drones, created]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create drone'));
                this.loadingSignal.set(false);
            }
        });
    };

    updateDrone = (updated: Drone): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.droneEndpoint.update(updated, updated.id).pipe(retry(2)).subscribe({
            next: drone => {
                this.dronesSignal.update(drones => drones.map(d => d.id === drone.id ? drone : d));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to update drone'));
                this.loadingSignal.set(false);
            }
        });
    };

    deleteDrone = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.droneEndpoint.delete(id).pipe(retry(2)).subscribe({
            next: () => {
                this.dronesSignal.update(drones => drones.filter(d => d.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete drone'));
                this.loadingSignal.set(false);
            }
        });
    };

    reloadDrones = (): void => {
        this.loadDrones();
    };

    private loadDrones = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        forkJoin({
            drones: this.droneEndpoint.getAll().pipe(retry(2)),
            nozzles: this.nozzleEndpoint.getAll().pipe(retry(2))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({drones, nozzles}) => {
                this.dronesSignal.set(drones);
                this.nozzlesSignal.set(nozzles);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load drones'));
                this.loadingSignal.set(false);
            }
        });
    };

    private formatError = (error: unknown, fallback: string): string => {
        if (error instanceof Error) {
            return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
        }
        return fallback;
    };
}