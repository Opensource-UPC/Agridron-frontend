import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {translatedError} from './Translate-error';
import {concatMap, defer, forkJoin, from, of, retry, switchMap, toArray} from 'rxjs';
import {Drone} from '../domain/model/drone.entity';
import {Nozzle, NozzleState} from '../domain/model/nozzle.entity';
import {DronApiEndpoint} from '../infrastructure/dron-api-endpoint';
import {NozzleApiEndpoint} from '../infrastructure/nozzle-api-endpoint';
import {
    Observable,
    catchError,
    finalize,
    tap,
    throwError
} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DroneStore {
    private readonly http = inject(HttpClient);
    private readonly droneEndpoint = new DronApiEndpoint(this.http);
    private readonly nozzleEndpoint = new NozzleApiEndpoint(this.http);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);

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

    /**
     * Registra un dron NUEVO. Registrarlo instala una boquilla, así que se descuenta
     * una unidad del stock de la boquilla elegida (primero se guarda la boquilla y,
     * si la creación del dron falla, se deshace ese cambio).
     */
    addDrone = (drone: Drone): Observable<Drone> => {
        let original: Nozzle | null = null;   // boquilla antes de descontar
        let nozzleSaved = false;              // ¿ya se guardó el descuento en el servidor?
        let savedNozzle: Nozzle | null = null;

        return defer(() => {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);

            const target = this.nozzles().find(n => n.id === drone.nozzleId);
            if (!target) throw new Error('Nozzle not found');
            original = target;

            return this.nozzleEndpoint.update(target.withUnitTaken(), target.id).pipe(
                tap(saved => {
                    nozzleSaved = true;
                    savedNozzle = saved;
                }),
                switchMap(() => this.droneEndpoint.create(drone)),
                tap(created => {
                    this.nozzlesSignal.update(list =>
                        list.map(n => n.id === savedNozzle!.id ? savedNozzle! : n));
                    this.dronesSignal.update(drones => [...drones, created]);
                })
            );
        }).pipe(
            catchError(err => this.rollbackNozzles(
                nozzleSaved && original ? [original] : [], err, 'errors.drone.create')),
            finalize(() => this.loadingSignal.set(false))
        );
    };

    /**
     * Cambia la boquilla instalada en un dron (DR-004, escenario 2).
     * - La boquilla nueva pierde una unidad de bodega (buena primero; si no hay, desgastada).
     * - La boquilla retirada vuelve a bodega en el estado que indicó el operador.
     * - El dron pasa a apuntar a la boquilla nueva.
     * Los pasos van en orden; si uno falla, se deshacen los anteriores.
     */
    changeDroneNozzle = (
        drone: Drone,
        newNozzleId: number,
        retiredState: NozzleState | null
    ): Observable<Drone> => {
        const originals = new Map<number, Nozzle>();
        const saved: Nozzle[] = [];

        return defer(() => {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);

            if (drone.status === 'in-flight') throw new Error('Drone is in flight');

            const target = this.nozzles().find(n => n.id === newNozzleId);
            if (!target) throw new Error('Nozzle not found');
            const current = this.nozzles().find(n => n.id === drone.nozzleId);

            originals.set(target.id, target);
            if (current) originals.set(current.id, current);

            let updatedTarget = target.withUnitTaken();
            let updatedCurrent: Nozzle | null = null;

            if (current && retiredState) {
                if (current.id === target.id) {
                    // Mismo registro: se toma una unidad y se devuelve la otra en un solo guardado.
                    updatedTarget = updatedTarget.withUnitReturned(retiredState);
                } else {
                    updatedCurrent = current.withUnitReturned(retiredState);
                }
            }

            const toSave = updatedCurrent ? [updatedTarget, updatedCurrent] : [updatedTarget];
            const updatedDrone = new Drone(
                drone.id, drone.serialNumber, drone.model, drone.batteryLevel,
                drone.status, newNozzleId, drone.tankCapacityLiters,drone.lastMaintenanceDate,
                drone.nextMaintenanceDate, drone.urlimg);

            return from(toSave).pipe(
                concatMap(n => this.nozzleEndpoint.update(n, n.id).pipe(
                    tap(result => saved.push(result)))),
                toArray(),
                switchMap(() => this.droneEndpoint.update(updatedDrone, drone.id)),
                tap(savedDrone => {
                    this.nozzlesSignal.update(list =>
                        list.map(n => saved.find(s => s.id === n.id) ?? n));
                    this.dronesSignal.update(drones =>
                        drones.map(d => d.id === savedDrone.id ? savedDrone : d));
                })
            );
        }).pipe(
            catchError(err => this.rollbackNozzles(
                saved.map(s => originals.get(s.id)!), err, 'errors.drone.changeNozzle')),
            finalize(() => this.loadingSignal.set(false))
        );
    };

    /**
     * Deshace (lo mejor posible) los guardados de boquillas ya hechos cuando un paso falla,
     * registra el error y lo vuelve a lanzar.
     */
    private rollbackNozzles = (
        toRestore: Nozzle[],
        error: unknown,
        operationKey: string
    ): Observable<never> => {
        const undo$ = toRestore.length > 0
            ? forkJoin(toRestore.map(n =>
                this.nozzleEndpoint.update(n, n.id).pipe(catchError(() => of(null)))))
            : of([]);

        return undo$.pipe(
            switchMap(() => {
                this.setError(error, operationKey);
                return throwError(() => error);
            })
        );
    };

    updateDrone = (updated: Drone): Observable<Drone> => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.droneEndpoint.update(updated, updated.id).pipe(
            tap(drone => {
                this.dronesSignal.update(drones =>
                    drones.map(d =>
                        d.id === drone.id ? drone : d
                    )
                );
            }),

            catchError(err => {
                this.setError(err, 'errors.drone.update');
                return throwError(() => err);
            }),

            finalize(() => {
                this.loadingSignal.set(false);
            })
        );
    };


    addNozzle = (nozzle: Nozzle): Observable<Nozzle> => {
        this.errorSignal.set(null);

        return this.nozzleEndpoint.create(nozzle).pipe(
            tap(created => {
                this.nozzlesSignal.update(list => [...list, created]);
            }),

            catchError(err => {
                this.setError(err, 'errors.nozzle.create');
                return throwError(() => err);
            })
        );
    };

    updateNozzle = (updated: Nozzle): Observable<Nozzle> => {
        this.errorSignal.set(null);

        return this.nozzleEndpoint.update(updated, updated.id).pipe(
            tap(saved => {
                this.nozzlesSignal.update(list =>
                    list.map(n => n.id === saved.id ? saved : n)
                );
            }),

            catchError(err => {
                this.setError(err, 'errors.nozzle.update');
                return throwError(() => err);
            })
        );
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
                this.setError(err, 'errors.drone.delete');
                this.loadingSignal.set(false);
            }
        });
    };

    reloadDrones = (): void => {
        this.loadDrones();
    };

    /**
     *
     */
    private loadDrones = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        forkJoin({ //Pide que se carguen los drones y las
            // boquillas
            drones: this.droneEndpoint.getAll().pipe(retry(2)),
            nozzles: this.nozzleEndpoint.getAll().pipe(retry(2))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({drones, nozzles}) => {
                this.dronesSignal.set(drones);
                this.nozzlesSignal.set(nozzles);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.setError(err, 'errors.drone.load');
                this.loadingSignal.set(false);
            }
        });
    };

    private setError = (error: unknown, operationKey: string): void => {
        translatedError(this.translate, error, operationKey)
            .subscribe(message => this.errorSignal.set(message));
    };
}