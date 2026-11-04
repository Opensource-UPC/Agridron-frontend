
import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Drone} from "../domain/model/drone.entity";
import {DroneResource, DroneResponse} from "./inventory-and-resource-management-response";
import {DRONE_STATUSES, DroneStatus} from "../domain/model/drone-status";

/**
 * Convierte el estado que llega de la API en un DroneStatus.
 * Un valor desconocido se trata como fuera de servicio
 * un dron con estado dudoso no debe quedar disponible para una misión.
 */
const toDroneStatus = (wire: string): DroneStatus => {
    const normalized = String(wire ?? '').trim().toLowerCase().replace(/_/g, '-');
    const found = DRONE_STATUSES.find(status => status === normalized);
    if (found) return found;
    console.warn(`Unknown drone status "${wire}", treated as out-of-service`);
    return DroneStatus.OUT_OF_SERVICE;
};


export class DronAssembler implements BaseAssembler<Drone, DroneResource, DroneResponse>
{

    toEntitiesFromResponse = (response: DroneResponse): Drone[] =>
    {
       return response.drones.map(resource => this.toEntityFromResource(resource));
    }
    toEntityFromResource = (resource: DroneResource): Drone => {
        return new Drone(
            resource.id,
            resource.serialNumber,
            resource.model,
            resource.batteryLevel
            , toDroneStatus(resource.status),
            resource.nozzleId,
            resource.tankCapacityLiters,
            resource.lastMaintenanceDate,
            resource.nextMaintenanceDate,
            resource.urlimg,
            resource.flightHours ?? 0,
           )
    }


    toResourceFromEntity = (entity: Drone): DroneResource =>
    {
       return {id:entity.id,
       serialNumber:entity.serialNumber,
       model:entity.model,
       batteryLevel:entity.batteryLevel,
       status:entity.status,
       nozzleId:entity.nozzleId,
           tankCapacityLiters:entity.tankCapacityLiters,
       lastMaintenanceDate:entity.lastMaintenanceDate,
       nextMaintenanceDate:entity.nextMaintenanceDate,
           urlimg:entity.urlimg,
           flightHours:entity.flightHours};
    }

}
