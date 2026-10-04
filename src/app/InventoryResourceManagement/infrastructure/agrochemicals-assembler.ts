
import {BaseAssembler} from "../../shared/infrastructure/base-assembler";
import {Agrochemicals} from "../domain/model/agrochemical.entity";
import {
    AgrochemicalResource,
    AgrochemicalsResponse,
    DroneResource,
    DroneResponse
} from "./inventory-and-resource-management-response";
import {Drone} from "../domain/model/drone.entity";

export class AgrochemicalsAssembler implements BaseAssembler<Agrochemicals, AgrochemicalResource, AgrochemicalsResponse> {

    toEntitiesFromResponse(r: AgrochemicalsResponse): Agrochemicals[] {

        return r.Agrochemicals.map(resource => this.toEntityFromResource(resource));
    }

    toEntityFromResource(r: AgrochemicalResource): Agrochemicals {
        return new Agrochemicals(r.id, r.name, r.type, r.stockLiters, r.minimumStockLiters, r.expirationDate);
    }


    toResourceFromEntity = (entity: Agrochemicals): AgrochemicalResource => {
        return {

            id: entity.id,
            name: entity.name,
            type: entity.type,
            stockLiters: entity.stockLiters,
            minimumStockLiters: entity.minimumStockLiters,
            expirationDate: entity.expirationDate
        };
    }

}
