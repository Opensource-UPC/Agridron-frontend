
import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Drone} from "../domain/model/drone.entity";
import {DroneResource, DroneResponse} from "./inventory-and-resource-management-response";

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
            , resource.status,
            resource.nozzleId,
            resource.lastMaintenanceDate,
            resource.nextMaintenanceDate,
            resource.urlimg)
    }


    toResourceFromEntity = (entity: Drone): DroneResource =>
    {
       return {id:entity.id,
       serialNumber:entity.serialNumber,
       model:entity.model,
       batteryLevel:entity.batteryLevel,
       status:entity.status,
       nozzleId:entity.nozzleId,
       lastMaintenanceDate:entity.lastMaintenanceDate,
       nextMaintenanceDate:entity.nextMaintenanceDate,
           urlimg:entity.urlimg};
    }

}
