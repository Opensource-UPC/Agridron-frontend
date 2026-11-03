import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {translatedError} from './Translate-error';
import {retry} from 'rxjs';
import {MaintenanceRecord} from "../domain/model/maintance-records.entity";
import {MaintenanceRecordsApiEndpoint} from "../infrastructure/maintenance-records-api-endpoint";

@Injectable({providedIn: 'root'})
export class MaintenanceRecordStore {
    private readonly http = inject(HttpClient);
    private readonly recordEndpoint = new MaintenanceRecordsApiEndpoint(this.http);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);

    private readonly recordsSignal = signal<MaintenanceRecord[]>([]);
    readonly records = this.recordsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    readonly recordCount = computed(() => this.records().length);

    constructor() {
        this.loadRecords();
    }

    getRecordsByDroneId = (droneId: number): Signal<MaintenanceRecord[]> =>
        computed(() => this.records().filter(r => r.droneId === droneId));

    addRecord = (record: MaintenanceRecord): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.recordEndpoint.create(record).pipe(retry(2)).subscribe({
            next: created => {
                this.recordsSignal.update(records => [...records, created]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.setError(err, 'errors.maintenance.create');
                this.loadingSignal.set(false);
            }
        });
    };

    updateRecord = (updated: MaintenanceRecord): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.recordEndpoint.update(updated, updated.id).pipe(retry(2)).subscribe({
            next: record => {
                this.recordsSignal.update(records => records.map(r => r.id === record.id ? record : r));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.setError(err, 'errors.maintenance.update');
                this.loadingSignal.set(false);
            }
        });
    };

    deleteRecord = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.recordEndpoint.delete(id).pipe(retry(2)).subscribe({
            next: () => {
                this.recordsSignal.update(records => records.filter(r => r.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.setError(err, 'errors.maintenance.delete');
                this.loadingSignal.set(false);
            }
        });
    };

    reloadRecords = (): void => {
        this.loadRecords();
    };

    private loadRecords = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.recordEndpoint.getAll().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: records => {
                this.recordsSignal.set(records);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.setError(err, 'errors.maintenance.load');
                this.loadingSignal.set(false);
            }
        });
    };

    private setError = (error: unknown, operationKey: string): void => {
        translatedError(this.translate, error, operationKey)
            .subscribe(message => this.errorSignal.set(message));
    };
}