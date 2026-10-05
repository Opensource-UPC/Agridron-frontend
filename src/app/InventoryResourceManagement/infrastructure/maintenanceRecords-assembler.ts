

import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import {MaintenanceRecord} from "../domain/model/maintance-records.entity";
import {MaintenanceRecordResource, MaintenanceRecordsResponse} from "./inventory-and-resource-management-response";

export class MaintenanceRecordAssembler implements BaseAssembler<MaintenanceRecord,
MaintenanceRecordResource, MaintenanceRecordsResponse> {

    toResourceFromEntity = (entity: MaintenanceRecord): MaintenanceRecordResource => {
        return {
            id: entity.id,
            droneId: entity.droneId,
            date: entity.date,
            type: entity.type,
            description: entity.description,
            technician: entity.technician
        };
    };

    toEntityFromResource = (resource: MaintenanceRecordResource): MaintenanceRecord => {
        return new MaintenanceRecord(
            resource.id,
            resource.droneId,
            resource.date,
            resource.type,
            resource.description,
            resource.technician
        );
    };

    toEntitiesFromResponse = (response: MaintenanceRecordsResponse): MaintenanceRecord[] => {
        return response.maintenanceRecords.map(resource => this.toEntityFromResource(resource));
    };
}