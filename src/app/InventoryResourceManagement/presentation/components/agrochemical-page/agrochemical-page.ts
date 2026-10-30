

import {ChangeDetectionStrategy, Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialog} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {AgrochemicalStore} from '../../../application/agrochemical-store';
import {AGROCHEMICAL_TYPES, Agrochemicals} from '../../../domain/model/agrochemical.entity';
import {
  AgrochemicalCreateDialog,
  AgrochemicalCreateResult,
  todayString
} from '../agrochemical-create-dialog/agrochemical-create-dialog';

/**
 * Pantalla "Agroquímicos": catálogo de productos autorizados (DR-003).
 * Ruta: /agrochemicals
 */
@Component({
  selector: 'app-agrochemical-page',
  imports: [TranslatePipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './agrochemical-page.html',
  styleUrl: './agrochemical-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgrochemicalPage {
  private readonly store = inject(AgrochemicalStore);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly agrochemicals = this.store.agrochemicals;
  protected readonly loading = this.store.loading;
  protected readonly error = this.store.error;
  protected readonly today = todayString();

  /** Los tipos que no están en la lista (datos antiguos) se muestran tal cual. */
  protected isKnownType(type: string): boolean {
    return (AGROCHEMICAL_TYPES as readonly string[]).includes(type);
  }

  protected openCreate(): void {
    this.dialog
        .open<AgrochemicalCreateDialog, Agrochemicals[], AgrochemicalCreateResult>(
            AgrochemicalCreateDialog, {data: this.agrochemicals(), width: '460px'})
        .afterClosed()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(result => {
          if (!result) return;
          this.store.addAgrochemical(new Agrochemicals(
              0, // el servidor asigna el id real
              result.name,
              result.type,
              result.activeIngredient,
              result.recommendedDoseLitersPerHa,
              result.stockLiters,
              result.minimumStockLiters,
              result.expirationDate
          ))
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({error: () => {}}); // el store guarda el error y esta pantalla lo muestra
        });
  }
}