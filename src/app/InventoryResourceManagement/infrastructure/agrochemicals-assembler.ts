import {BaseAssembler} from "../../shared/infrastructure/base-assembler";
import {Agrochemicals} from "../domain/model/agrochemical.entity";
import {
    AgrochemicalResource,
    AgrochemicalsResponse
} from "./inventory-and-resource-management-response";

export class AgrochemicalsAssembler implements BaseAssembler<Agrochemicals, AgrochemicalResource, AgrochemicalsResponse> {

    toEntitiesFromResponse(r: AgrochemicalsResponse): Agrochemicals[] {
        return r.Agrochemicals.map(resource => this.toEntityFromResource(resource));
    }

    toEntityFromResource(r: AgrochemicalResource): Agrochemicals {
        // Los registros antiguos del servidor pueden no traer ingrediente activo ni dosis.
        return new Agrochemicals(
            r.id,
            r.name,
            r.type,
            r.activeIngredient ?? '',
            r.recommendedDoseLitersPerHa ?? 0,
            r.stockLiters,
            r.minimumStockLiters,
            r.expirationDate
        );
    }

    toResourceFromEntity = (entity: Agrochemicals): AgrochemicalResource => {
        return {
            id: entity.id,
            name: entity.name,
            type: entity.type,
            activeIngredient: entity.activeIngredient,
            recommendedDoseLitersPerHa: entity.recommendedDoseLitersPerHa,
            stockLiters: entity.stockLiters,
            minimumStockLiters: entity.minimumStockLiters,
            expirationDate: entity.expirationDate
        };
    }
}