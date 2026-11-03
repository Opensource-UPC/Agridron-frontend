import { Nozzle } from '../domain/model/nozzle.entity';
import { NozzleResource, NozzlesResponse} from "./inventory-and-resource-management-response";
import {BaseAssembler} from "../../shared/infrastructure/base-assembler";

export class NozzleAssembler implements BaseAssembler<Nozzle,NozzleResource,NozzlesResponse> {
    /**
     * Transforma una Entidad de dominio a un Resource (DTO).
     * El total (stockUnits) no se guarda: se calcula sumando los tres contadores.
     */
    toResourceFromEntity(entity: Nozzle): NozzleResource {
        return {
            id: entity.id,
            type: entity.type,
            diameterMm: entity.getDiameterMm(),
            goodUnits: entity.goodUnits,
            wornUnits: entity.wornUnits,
            damagedUnits: entity.damagedUnits,
        };
    }


    toEntityFromResource(resource: NozzleResource): Nozzle {
        return new Nozzle(
            resource.id,
            resource.type,
            resource.diameterMm,
            resource.goodUnits,
            resource.wornUnits,
            resource.damagedUnits
        );
    }

    /**
     * Transforma la respuesta completa del endpoint a un arreglo de Entidades
     */
    toEntitiesFromResponse(response: NozzlesResponse): Nozzle[] {
        return response.nozzles.map(resource => this.toEntityFromResource(resource));
    }
}