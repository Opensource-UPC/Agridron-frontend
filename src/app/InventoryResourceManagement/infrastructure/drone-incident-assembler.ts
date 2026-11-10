import {BaseAssembler} from "../../shared/infrastructure/base-assembler";
import {DroneIncident, IncidentStatus} from "../domain/model/drone-incident.entity";
import {DroneIncidentResource, DroneIncidentsResponse} from "./inventory-and-resource-management-response";

/**
 * Convierte el estado que llega de la API en un IncidentStatus.
 * Acepta 'reported' (db.json) y 'REPORTED' (formato del informe).
 * Un valor desconocido se trata como pendiente: es lo más seguro, porque así el dron
 * no queda habilitado por error.
 */
const toIncidentStatus = (wire: string): IncidentStatus => {
    const normalized = String(wire ?? '').trim().toLowerCase();
    const found = Object.values(IncidentStatus).find(status => status === normalized);
    if (found) return found;
    console.warn(`Unknown incident status "${wire}", treated as reported`);
    return IncidentStatus.REPORTED;
};

export class DroneIncidentAssembler implements BaseAssembler<DroneIncident, DroneIncidentResource, DroneIncidentsResponse> {

    toEntitiesFromResponse = (response: DroneIncidentsResponse): DroneIncident[] =>
        response.droneIncidents.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: DroneIncidentResource): DroneIncident =>
        new DroneIncident(
            resource.id,
            resource.droneId,
            resource.description,
            resource.reportedAt,
            resource.resolvedAt ?? null,
            toIncidentStatus(resource.status),
            resource.repairRecordId ?? null
        );

    toResourceFromEntity = (entity: DroneIncident): DroneIncidentResource => ({
        id: entity.id,
        droneId: entity.droneId,
        description: entity.description,
        reportedAt: entity.reportedAt,
        resolvedAt: entity.resolvedAt,
        status: entity.status,
        repairRecordId: entity.repairRecordId
    });
}