import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {PerformanceIndicator} from '../domain/model/performance-indicator.entity';
import {AnalyticsAndReportingApi} from '../infrastructure/analytics-and-reporting-api';

/**
 * Holds performance indicator application state.
 */
@Injectable({
    providedIn: 'root'
})
export class PerformanceIndicatorStore {
    private readonly analyticsApi = inject(AnalyticsAndReportingApi);
    private readonly destroyRef = inject(DestroyRef);

    /** Computed signal for the count of indicators. */
    readonly indicatorCount = computed(() => this.indicators().length);

    private readonly indicatorsSignal = signal<PerformanceIndicator[]>([]);

    /** Readonly signal for the list of indicators. */
    readonly indicators = this.indicatorsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);

    /** Readonly signal indicating if data is loading. */
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);

    /** Readonly signal for the current error message. */
    readonly error = this.errorSignal.asReadonly();

    constructor() {
        this.loadIndicators();
    }

    /**
     * Selects the indicators of a given period.
     * @param period - Period label (for example, 2026-09).
     */
    getIndicatorsByPeriod = (period: string): Signal<PerformanceIndicator[]> =>
        computed(() => this.indicators().filter(i => i.period === period));

    /**
     * Registers a new indicator.
     * @param indicator - The indicator to add.
     */
    addIndicator = (indicator: PerformanceIndicator): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.analyticsApi.createPerformanceIndicator(indicator).pipe(retry(2)).subscribe({
            next: created => {
                this.indicatorsSignal.update(indicators => [...indicators, created]);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to create indicator'));
                this.loadingSignal.set(false);
            }
        });
    };

    /**
     * Reloads all indicators from the API.
     */
    reloadIndicators = (): void => {
        this.loadIndicators();
    };

    private loadIndicators = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.analyticsApi.getAllPerformanceIndicators().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: indicators => {
                this.indicatorsSignal.set(indicators);
                this.loadingSignal.set(false);
                this.errorSignal.set(null);
            },
            error: err => {
                this.errorSignal.set(this.formatError(err, 'Failed to load indicators'));
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
