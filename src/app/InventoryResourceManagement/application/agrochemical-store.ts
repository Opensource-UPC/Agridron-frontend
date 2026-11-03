

import {computed, DestroyRef, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Observable, retry, tap, catchError, throwError} from 'rxjs';
import {translatedError} from './Translate-error';
import {Agrochemicals} from '../domain/model/agrochemical.entity';
import {AgrochemicalsApiEndpoint} from '../infrastructure/agrochemicals-api-endpoint';

/**
 * Catálogo de agroquímicos autorizados (DR-003).
 * Otros contextos (misiones, reportes) solo deben LEER `agrochemicals` y guardar el id.
 */
@Injectable({providedIn: 'root'})
export class AgrochemicalStore {
    private readonly http = inject(HttpClient);
    private readonly endpoint = new AgrochemicalsApiEndpoint(this.http);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);

    private readonly agrochemicalsSignal = signal<Agrochemicals[]>([]);
    readonly agrochemicals = this.agrochemicalsSignal.asReadonly();

    private readonly loadingSignal = signal<boolean>(false);
    readonly loading = this.loadingSignal.asReadonly();

    private readonly errorSignal = signal<string | null>(null);
    readonly error = this.errorSignal.asReadonly();

    readonly count = computed(() => this.agrochemicals().length);

    constructor() {
        this.load();
    }

    /** Registra un producto nuevo; queda habilitado en el catálogo al guardarse. */
    addAgrochemical = (agrochemical: Agrochemicals): Observable<Agrochemicals> => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.endpoint.create(agrochemical).pipe(
            tap(created => {
                this.agrochemicalsSignal.update(list => [...list, created]);
                this.loadingSignal.set(false);
            }),
            catchError(err => {
                this.setError(err, 'errors.agrochemical.create');
                this.loadingSignal.set(false);
                return throwError(() => err);
            })
        );
    };

    reload = (): void => {
        this.load();
    };

    private load = (): void => {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);
        this.endpoint.getAll().pipe(retry(2), takeUntilDestroyed(this.destroyRef)).subscribe({
            next: list => {
                this.agrochemicalsSignal.set(list);
                this.loadingSignal.set(false);
            },
            error: err => {
                this.setError(err, 'errors.agrochemical.load');
                this.loadingSignal.set(false);
            }
        });
    };

    private setError = (error: unknown, operationKey: string): void => {
        translatedError(this.translate, error, operationKey)
            .subscribe(message => this.errorSignal.set(message));
    };
}