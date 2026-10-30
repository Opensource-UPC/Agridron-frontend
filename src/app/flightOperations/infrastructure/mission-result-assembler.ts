import {BaseAssembler} from "../../shared/infrastructure/base-assembler";
import {MissionResult} from "../domain/model/mission-result.entity";
import {MissionResultResource, MissionResultResponse} from "./flight-operations-response";

export class MissionResultAssembler implements BaseAssembler
    <MissionResult, MissionResultResource, MissionResultResponse>{

    toEntitiesFromResponse = (response: MissionResultResponse): MissionResult[] =>
        response.missionResults.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: MissionResultResource): MissionResult =>
        new MissionResult(
            resource.id,
            resource.missionId,
            resource.treatedArea,
            resource.appliedVolume,
            resource.observations);

    toResourceFromEntity = (entity: MissionResult): MissionResultResource =>({
        id: entity.id,
        missionId: entity.missionId,
        treatedArea: entity.treatedArea ?? null,
        appliedVolume: entity.appliedVolume ?? null,
        observations: entity.observations ?? null
    });
}