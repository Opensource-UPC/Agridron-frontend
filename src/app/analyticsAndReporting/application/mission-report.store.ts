import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin, retry} from 'rxjs';
import {MissionReport} from '../domain/model/mission-report.entity';
import {AnalyticsAndReportingApi} from '../infrastructure/analytics-and-reporting-api';

/**
 * Holds mission report application state (with their operational metrics).
 */
@Injectable({
    providedIn: 'root'
})
export class MissionReportStore {
    private readonly analyticsApi = inject(AnalyticsAndReportingApi);
    private readonly destroyRef = inject(DestroyRef);

    /** Computed signal for the count of reports. */
    readonly reportCount = computed(() => this.reports().length);

    private readonly reportsSignal = signal<MissionReport[]>([]);

    /** Readonly signal for the list of reports. */
    readonly reports = this.reportsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);

    /** Readonly signal indicating if data is loading. */
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);

    /** Readonly signal for the current error message. */
    readonly error = this.errorSignal.asReadonly();

    constructor() {
        this.loadReports();
    }

    /**
     * Selects a report by identifier.
     * @param id - Report identifier.
     */
    getReportById = (id: number): Signal<MissionReport | undefined> =>
        computed(() => id ? this.reports().find(r => r.id === id) : undefined);

    /**
     * Selects the reports of a given mission.
     * @param missionId - Mission identifier.
     */
    getReportsByMissionId = (missionId: number): Signal<MissionReport[]> =>
        computed(() => this.reports().filter(r => r.missionId === missionId));

    /**
     * Generates (creates) a new report.
     * @param report - The report to add.
     */
    addReport = (report: MissionReport): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.analyticsApi.createMissionReport(report).pipe(retry(2)).subscribe({
            next: createdReport => {
                createdReport.metrics = report.metrics ?? [];
                this.reportsSignal.update(reports => [...reports, createdReport]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create report'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Deletes a report by ID.
     * @param id - The ID of the report to delete.
     */
    deleteReport = (id: number): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.analyticsApi.deleteMissionReport(id).pipe(retry(2)).subscribe({
            next: () => {
                this.reportsSignal.update(reports => reports.filter(r => r.id !== id));
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to delete report'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all reports from the API.
     */
    reloadReports = (): void => {
        this.loadReports();
    };

    /**
     * Loads all reports with their operational metrics from the API.
     */
    private loadReports = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        forkJoin({
            reports: this.analyticsApi.getAllMissionReports().pipe(retry(2)),
            metrics: this.analyticsApi.getAllOperationalMetrics().pipe(retry(2))
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: ({reports, metrics}) => {
                reports.forEach(report => {
                    report.metrics = metrics.filter(m => m.reportId === report.id);
                });
                this.reportsSignal.set(reports);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load reports'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Normalizes unknown errors into a display-friendly message.
     */
    private formatError = (error: unknown, fallback: string): string => {
        if (error instanceof Error) {
            return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
        }
        return fallback;
    };
}
