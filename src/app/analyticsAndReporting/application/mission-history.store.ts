import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {MissionHistory} from '../domain/model/mission-history.entity';
import {AnalyticsAndReportingApi} from '../infrastructure/analytics-and-reporting-api';

/**
 * Holds mission history application state.
 */
@Injectable({
    providedIn: 'root'
})
export class MissionHistoryStore {
    private readonly analyticsApi = inject(AnalyticsAndReportingApi);
    private readonly destroyRef = inject(DestroyRef);

    /** Computed signal for the count of history records. */
    readonly historyCount = computed(() => this.histories().length);

    private readonly historiesSignal = signal<MissionHistory[]>([]);

    /** Readonly signal for the list of history records. */
    readonly histories = this.historiesSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);

    /** Readonly signal indicating if data is loading. */
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);

    /** Readonly signal for the current error message. */
    readonly error = this.errorSignal.asReadonly();

    constructor() {
        this.loadHistories();
    }

    /**
     * Selects the history records completed on a given day.
     * @param date - Day in YYYY-MM-DD format.
     */
    findByDate = (date: string): Signal<MissionHistory[]> =>
        computed(() => this.histories().filter(h => h.isCompletedOn(date)));

    /**
     * Selects the history record of a mission.
     * @param missionId - Mission identifier.
     */
    getHistoryByMissionId = (missionId: number): Signal<MissionHistory | undefined> =>
        computed(() => this.histories().find(h => h.missionId === missionId));

    /**
     * Registers a new history record.
     * @param history - The record to add.
     */
    addHistory = (history: MissionHistory): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.analyticsApi.createMissionHistory(history).pipe(retry(2)).subscribe({
            next: created => {
                this.historiesSignal.update(histories => [...histories, created]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to register history'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all history records from the API.
     */
    reloadHistories = (): void => {
        this.loadHistories();
    };

    private loadHistories = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.analyticsApi.getAllMissionHistories().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: histories => {
                this.historiesSignal.set(histories);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load history'));
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
