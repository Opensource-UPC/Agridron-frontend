
import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Drone} from '../../../domain/model/drone.entity';
import {Nozzle} from '../../../domain/model/nozzle.entity';
import {DroneItem} from '../dron-item/dron-item';

/**
 * Muestra una cuadrícula de tarjetas de drones.
 * Igual que la tarjeta, es un componente "tonto": recibe datos por `input`
 * y avisa por `output`. No conoce el store.
 */
@Component({
  selector: 'app-drone-list',
  imports: [DroneItem, TranslatePipe], // DroneItem: porque el HTML usa <app-drone-item>
  templateUrl: './dron-list.html',
  styleUrl: './dron-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DroneList {
  // ---------- ENTRADAS ----------

  /** Los drones a mostrar. El padre decide cuáles (todos, o filtrados por pestaña). */
  drones = input.required<Drone[]>();

  /** Todas las boquillas. Cada tarjeta recibe la suya, buscada por `drone.nozzleId`. */
  nozzles = input<Nozzle[]>([]);

  /** Mientras es true, la lista vacía dice "Cargando..." en vez de "Sin drones". */
  loading = input<boolean>(false);

  // ---------- SALIDAS ----------
  // La lista no hace nada con estos clics: los reenvía al padre (ver el HTML).

  viewDetails = output<number>();
  viewMaintenance = output<number>();

  // ---------- VALOR DERIVADO ----------

  /**
   * Índice de boquillas por id: Map { 1 => Nozzle, 2 => Nozzle... }.
   * Con él, buscar la boquilla de cada dron es directo (`.get(id)`), en vez de
   * recorrer todo el array con `.find` por cada tarjeta. Al ser `computed`, se
   * reconstruye solo cuando cambia el input `nozzles`.
   */
  protected nozzlesById = computed(() =>
      new Map(this.nozzles().map(nozzle => [nozzle.id, nozzle] as const)));
}