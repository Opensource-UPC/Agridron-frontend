

import { Nozzle } from '../domain/model/nozzle.entity';
import { NozzleResource, NozzlesResponse} from "./inventory-and-resource-management-response";
import {BaseAssembler} from "../../shared/infrastructure/base-assembler";

export class NozzleAssembler implements BaseAssembler<Nozzle,NozzleResource,NozzlesResponse> {
    /**
     * Transforma una Entidad de dominio a un Resource (DTO)
     */
    toResourceFromEntity(entity: Nozzle): NozzleResource {
        return {
            id: entity.getId(),
            type: entity.getType(),
            diameterMm: entity.getDiameterMm(),
            stockUnits: entity.getStockUnits(),
            status: entity.getStatus()
        };
    }


    toEntityFromResource(resource: NozzleResource): Nozzle {
        return new Nozzle(
            resource.id,
            resource.type,
            resource.diameterMm,
            resource.stockUnits,
            resource.status
        );
    }

    /**
     * Transforma la respuesta completa del endpoint a un arreglo de Entidades
     */
    toEntitiesFromResponse(response: NozzlesResponse): Nozzle[] {
        return response.nozzles.map(resource => this.toEntityFromResource(resource));
    }
}


