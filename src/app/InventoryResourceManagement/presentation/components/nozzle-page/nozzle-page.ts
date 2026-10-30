
import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DroneStore} from '../../../application/dron-store';
import {Nozzle} from '../../../domain/model/nozzle.entity';
import {NozzleCreateDialog, NozzleCreateResult} from '../nozzle-create-dialog/nozzle-create-dialog';
import {NozzleTypeLabel} from '../nozzle-type-label/nozzle-type-label';
import {NozzleRestockDialog} from '../nozzle-restock-dialog/nozzle-restock-dialog';
import {NozzleStatusChange, NozzleStatusDialog} from '../nozzle-status-dialog/nozzle-status-dialog';

/**
 * Pantalla "Boquillas": catálogo de todas las boquillas con su stock por estado (DR-004).
 * Ruta: /drones/nozzles
 *
 * Acciones: nueva boquilla, reponer stock y actualizar estado.
 */
@Component({
    selector: 'app-nozzle-page',
    imports: [TranslatePipe, NozzleTypeLabel, MatButtonModule, MatCardModule, MatIconModule],
    templateUrl: './nozzle-page.html',
    styleUrl: './nozzle-page.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NozzlePage {
    private readonly store = inject(DroneStore);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly nozzles = this.store.nozzles;
    protected readonly loading = this.store.loading;
    protected readonly error = this.store.error;

    protected goBack(): void {
        void this.router.navigate(['/drones']);
    }

    /** Nueva boquilla: la registra con sus unidades iniciales, todas buenas. */
    protected openCreate(): void {
        this.dialog
            .open<NozzleCreateDialog, Nozzle[], NozzleCreateResult>(NozzleCreateDialog,
                {data: this.nozzles(), width: '420px'})
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(result => {
                if (!result) return;
                this.save(this.store.addNozzle(
                    new Nozzle(0, result.type, result.diameterMm, result.goodUnits, 0, 0)));
            });
    }

    /** Reponer stock: suma unidades buenas a la boquilla elegida. */
    protected openRestock(nozzle: Nozzle): void {
        this.dialog
            .open<NozzleRestockDialog, Nozzle, number>(NozzleRestockDialog,
                {data: nozzle, width: '420px'})
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(units => {
                if (!units) return;
                this.save(this.store.updateNozzle(nozzle.withRestocked(units)));
            });
    }

    /** Actualizar estado: pasa unidades de un estado a otro. */
    protected openStatusUpdate(nozzle: Nozzle): void {
        this.dialog
            .open<NozzleStatusDialog, Nozzle, NozzleStatusChange>(NozzleStatusDialog,
                {data: nozzle, width: '420px'})
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(change => {
                if (!change) return;
                this.save(this.store.updateNozzle(
                    nozzle.withUnitsMoved(change.from, change.to, change.quantity)));
            });
    }

    /** Lanza la operación; si falla, el store guarda el error y esta pantalla lo muestra. */
    private save(operation: Observable<Nozzle>): void {
        operation
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({error: () => {}});
    }
}