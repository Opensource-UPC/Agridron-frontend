import {BaseAssembler} from "../../shared/infrastructure/base-assembler";
import {OperationStatus} from "../domain/model/operation-status.entity";
import {OperationStatusResource, OperationStatusResponse} from "./flight-operations-response";

export class OperationStatusAssembler implements
    BaseAssembler<OperationStatus, OperationStatusResource, OperationStatusResponse>{
    toEntitiesFromResponse = (response: OperationStatusResponse): OperationStatus[] =>
        response.operationStatuses.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: OperationStatusResource): OperationStatus =>
        new OperationStatus(
            resource.id,
            resource.missionId,
            resource.latitude,
            resource.longitude,
            resource.status,
            resource.timestamp ? new Date(resource.timestamp) : null
        );

    toResourceFromEntity = (entity: OperationStatus): OperationStatusResource => ({
        id: entity.id,
        missionId: entity.missionId,
        status: entity.status,
        latitude: entity.latitude,
        longitude: entity.longitude,
        timestamp: entity.timestamp instanceof Date
            ? entity.timestamp.toISOString()
            : (entity.timestamp ? String(entity.timestamp) : '')
    });
}