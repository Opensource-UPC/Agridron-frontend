import {BaseAssembler} from "../../shared/infrastructure/base-assembler";
import {Mission} from "../domain/model/mission.entity";
import {MissionResource, FlightOperationsResponse} from "./flight-operations-response";

export class MissionAssembler implements BaseAssembler<Mission, MissionResource, FlightOperationsResponse> {
    toEntitiesFromResponse = (response: FlightOperationsResponse): Mission[] =>
        response.missions.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: MissionResource): Mission =>
        new Mission(
            resource.id,
            resource.requestedDate ? new Date(resource.requestedDate) : null,
            resource.parcelId,
            resource.agrochemicalId,
            resource.droneId,
            resource.operatorId,
            resource.flightHeight,
            resource.flightSpeed,
            resource.sprayRate,
            resource.overlap,
            resource.status
        );

    toResourceFromEntity = (entity: Mission): MissionResource => ({
        id: entity.id,
        requestedDate: entity.requestedDate instanceof Date
            ? entity.requestedDate.toISOString()
            : (entity.requestedDate ? String(entity.requestedDate) : ''),
        parcelId: entity.parcelId,
        agrochemicalId: entity.agrochemicalId,
        droneId: entity.droneId,
        operatorId: entity.operatorId,
        flightHeight: entity.flightHeight,
        flightSpeed: entity.flightSpeed,
        sprayRate: entity.sprayRate,
        overlap: entity.overlap,
        status: entity.status!
    });
}