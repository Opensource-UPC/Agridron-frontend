import {BaseAssembler} from "../../shared/infrastructure/base-assembler";
import {Incident} from "../domain/model/incident.entity";
import {IncidentResource, IncidentResponse} from "./flight-operations-response";

export class IncidentAssembler implements BaseAssembler<Incident, IncidentResource, IncidentResponse>{
    toEntitiesFromResponse = (response: IncidentResponse): Incident[] =>
        response.incidents.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: IncidentResource): Incident =>
        new Incident(
            resource.id,
            resource.missionId,
            resource.type,
            resource.description,
            resource.occurredAt ? new Date(resource.occurredAt) : null
        );

    toResourceFromEntity = (entity: Incident): IncidentResource => ({
            id: entity.id,
            missionId: entity.missionId,
            type: entity.type,
            description: entity.description,
            occurredAt: entity.occurredAt instanceof Date ? entity.occurredAt.toISOString() : (entity.occurredAt ? String(entity.occurredAt) : ''),
        }
    )
}