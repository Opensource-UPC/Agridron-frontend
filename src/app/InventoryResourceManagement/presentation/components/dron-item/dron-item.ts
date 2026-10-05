
import {ChangeDetectionStrategy, Component, computed, input, output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Drone} from '../../../domain/model/drone.entity';
import {Nozzle} from '../../../domain/model/nozzle.entity';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Tarjeta que muestra UN dron. Es un componente "tonto": no conoce el store
 * ni la API, solo recibe datos por `input` y avisa por `output` cuando
 * se pulsa un botón.
 */
@Component({
  selector: 'app-drone-item',
  imports: [DatePipe, TranslatePipe], // necesario para usar `| date` en el HTML
  templateUrl: './dron-item.html',
  styleUrl: './dron-item.css',
  // OnPush: solo se vuelve a dibujar si cambia alguno de sus inputs.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DroneItem {
  // ---------- ENTRADAS (datos que manda el padre) ----------

  imageUrl = input('');
  /** El dron a mostrar. `required`: el padre está obligado a enviarlo. */
  drone = input.required<Drone>();

  /**
   * La boquilla del dron. El padre la busca con `drone.nozzleId`.
   * Es opcional porque puede no encontrarse.
   */
  nozzle = input<Nozzle | undefined>();

  /**
   * Agroquímicos compatibles (ej. ['Fungicidas', 'Herbicidas']).
   * Opcional: tu `Drone` todavía no tiene este dato, así que el padre
   * decide de dónde sale. Si viene vacío, la línea no se muestra.
   */
  chemicals = input<string[]>([]);

  /**
   * URL de la foto. Tu `Drone` tampoco tiene imagen aún. Si viene vacía
   * se muestra un recuadro "Sin foto".
   */

  // ---------- SALIDAS (avisos al padre) ----------

  /** Se emite con el id del dron al pulsar "Ver detalles". */
  viewDetails = output<number>();

  /** Se emite con el id del dron al pulsar "Ver mantenimientos". */
  viewMaintenance = output<number>();


  /** Batería limitada entre 0 y 100, para que la barra nunca se desborde. */
  protected battery = computed(() =>
      Math.max(0, Math.min(100, this.drone().batteryLevel)));

  /** Batería baja: la barra cambia a rojo por debajo del 20 %. */
  protected isLowBattery = computed(() => this.battery() < 20);

  /**
   * Texto de la boquilla.
   * AJUSTA AQUÍ el campo real de tu entidad Nozzle. En el diseño se ve
   * "Cono Hueco (TX-VK8)", así que podría ser algo como:
   *   `${nozzle.type} (${nozzle.model})`
   * Si `name` no existe en tu Nozzle, TypeScript marcará error justo en
   * esta línea, y es el único lugar que tienes que cambiar.
   */
  protected nozzleLabel = computed(() => {
    const nozzle = this.nozzle();
    return nozzle ? nozzle.type : 'Sin boquilla';
  });

  /** Une la lista con comas y "y" antes del último: "A, B y C". */
  protected chemicalsText = computed(() => {
    const list = this.chemicals();
    if (list.length <= 1) return list.join('');
    return list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1];
  });
}