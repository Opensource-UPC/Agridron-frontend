import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NOZZLE_TYPES} from '../../../domain/model/nozzle.entity';

/**
 * Muestra el nombre de un tipo de boquilla.
 * Si es uno de la lista (flat-fan, hollow-cone...) usa su traducción;
 * si es un tipo escrito a mano ("Otro"), lo muestra tal como se registró.
 *
 * Uso: <app-nozzle-type-label [type]="nozzle.type"/>
 */
@Component({
  selector: 'app-nozzle-type-label',
  imports: [TranslatePipe],
  templateUrl: './nozzle-type-label.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NozzleTypeLabel {
  readonly type = input.required<string>();

  protected readonly known = computed(() =>
      (NOZZLE_TYPES as readonly string[]).includes(this.type()));
}