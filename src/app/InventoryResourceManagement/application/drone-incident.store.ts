import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Observable, catchError, defer, finalize, map, retry, switchMap, tap, throwError} from 'rxjs';
import {translatedError} from './Translate-error';
import {DroneStore} from './dron-store';
import {MaintenanceRecordStore} from './maintenance-record.store';
import {MaintenanceRecord} from '../domain/model/maintance-records.entity';
import {Drone} from '../domain/model/drone.entity';
import {DroneStatus} from '../domain/model/drone-status';
import {DroneIncident, IncidentStatus} from '../domain/model/drone-incident.entity';
import {todayIso} from '../domain/model/local-date';
import {DroneIncidentApiEndpoint} from '../infrastructure/drone-incident-api-endpoint';

/** Datos que pide el diálogo de reparación. */
export interface RepairData {
    date: string;
    description: string;
    technician: string;
}

/**
 * Incidentes y fallas de los drones (DR-006).
 *
 * Reglas: un dron fuera de servicio no se puede reportar de nuevo, y un dron tiene
 * como máximo un incidente pendiente a la vez.
 */
@Injectable({providedIn: 'root'})
export class DroneIncidentStore {
    private readonly http = inject(HttpClient);
    private readonly endpoint = new DroneIncidentApiEndpoint(this.http);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);
    private readonly droneStore = inject(DroneStore);
    private readonly recordStore = inject(MaintenanceRecordStore);

    private readonly incidentsSignal = signal<DroneIncident[]>([]);
    readonly incidents = this.incidentsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    constructor() {
        this.load();
    }

    /** Incidente pendiente de reparación de un dron (como máximo uno). */
    getPendingIncident = (droneId: number): Signal<DroneIncident | undefined> =>
        computed(() => this.incidents().find(i => i.droneId === droneId && i.pending));

    /** Incidentes ya reparados de un dron, del más reciente al más antiguo. */
    getResolvedIncidents = (droneId: number): Signal<DroneIncident[]> =>
        computed(() => this.incidents()
            .filter(i => i.droneId === droneId && !i.pending)
            .sort((a, b) => (b.resolvedAt ?? '').localeCompare(a.resolvedAt ?? '')));

    /**
     * Reporta una falla: crea el incidente pendiente y pasa el dron a fuera de servicio.
     * Si falla el segundo paso, se deshace el incidente recién creado.
     */
    reportIncident = (drone: Drone, description: string): Observable<DroneIncident> => {
        let created: DroneIncident | null = null;

        return defer(() => {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);

            if (drone.status === DroneStatus.OUT_OF_SERVICE) throw new Error('Drone is already out of service');
            if (this.incidents().some(i => i.droneId === drone.id && i.pending)) {
                throw new Error('Drone already has a pending incident');
            }

            return this.endpoint.create(new DroneIncident(
                0, drone.id, description, todayIso(), null, IncidentStatus.REPORTED, null));
        }).pipe(
            tap(saved => {
                created = saved;
                this.incidentsSignal.update(list => [...list, saved]);
            }),
            switchMap(saved => this.droneStore
                .updateDrone(drone.withStatus(DroneStatus.OUT_OF_SERVICE))
                .pipe(map(() => saved))),
            catchError(err => this.rollbackReport(created, err)),
            finalize(() => this.loadingSignal.set(false))
        );
    };

    /**
     * Registra la reparación de un incidente pendiente, en tres pasos:
     * 1) crea el mantenimiento correctivo, 2) cierra el incidente enlazándolo con ese
     * mantenimiento y 3) devuelve el dron a disponible.
     * Si un paso falla, se deshacen los anteriores.
     */
    registerRepair = (
        incident: DroneIncident,
        drone: Drone,
        repair: RepairData
    ): Observable<DroneIncident> => {
        let record: MaintenanceRecord | null = null;
        let incidentSaved = false;

        return defer(() => {
            this.loadingSignal.set(true);
            this.errorSignal.set(null);

            if (!incident.pending) throw new Error('Incident is not pending');

            return this.recordStore.registerMaintenance(
                new MaintenanceRecord(0, drone.id, repair.date, 'corrective',
                    repair.description, repair.technician),
                drone,
                null
            );
        }).pipe(
            tap(saved => record = saved),
            switchMap(saved => this.endpoint.update(
                incident.withResolution(repair.date, saved.id), incident.id)),
            tap(resolved => {
                incidentSaved = true;
                this.incidentsSignal.update(list => list.map(i => i.id === resolved.id ? resolved : i));
            }),
            switchMap(resolved => this.droneStore
                .updateDrone(drone.withStatus(DroneStatus.AVAILABLE))
                .pipe(map(() => resolved))),
            catchError(err => this.rollbackRepair(incident, record, incidentSaved, err)),
            finalize(() => this.loadingSignal.set(false))
        );
    };

    /** Deshace los pasos de la reparación que ya se guardaron, y relanza el error. */
    private rollbackRepair = (
        original: DroneIncident,
        record: MaintenanceRecord | null,
        incidentSaved: boolean,
        err: unknown
    ): Observable<never> => {
        if (incidentSaved) {
            this.incidentsSignal.update(list => list.map(i => i.id === original.id ? original : i));
            this.endpoint.update(original, original.id).subscribe({error: () => {}});
        }
        if (record) {
            this.recordStore.deleteRecord(record.id);
        }
        this.setError(err, 'errors.incident.repair');
        return throwError(() => err);
    };

    /** Deshace el incidente ya guardado cuando falla un paso posterior, y relanza el error. */
    private rollbackReport = (created: DroneIncident | null, err: unknown): Observable<never> => {
        if (created) {
            const id = created.id;
            this.incidentsSignal.update(list => list.filter(i => i.id !== id));
            this.endpoint.delete(id).subscribe({error: () => {}});
        }
        this.setError(err, 'errors.incident.report');
        return throwError(() => err);
    };

    private load = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.endpoint.getAll().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: list => {
                this.incidentsSignal.set(list);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.setError(err, 'errors.incident.load');
                this.loadingSignal.set(false);
            }
        });
    };

    private setError = (error: unknown, operationKey: string): void => {
        translatedError(this.translate, error, operationKey)
            .subscribe(message => this.errorSignal.set(message));
    };
}