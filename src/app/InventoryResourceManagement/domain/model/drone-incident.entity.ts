/** Estado de un incidente de dron: pendiente de reparación o ya reparado. */
export enum IncidentStatus {
    REPORTED = 'reported',
    RESOLVED = 'resolved'
}

/**
 * Falla o incidente técnico de un dron (DR-006).
 *
 * - reportedAt / resolvedAt: fechas AAAA-MM-DD. resolvedAt es null mientras esté pendiente.
 * - repairRecordId: mantenimiento correctivo que reparó la falla; null mientras esté pendiente.
 */
export class DroneIncident {
    id: number;
    droneId: number;
    description: string;
    reportedAt: string;
    resolvedAt: string | null;
    status: IncidentStatus;
    repairRecordId: number | null;

    constructor(
        id: number,
        droneId: number,
        description: string,
        reportedAt: string,
        resolvedAt: string | null,
        status: IncidentStatus,
        repairRecordId: number | null
    ) {
        this.id = id;
        this.droneId = droneId;
        this.description = description;
        this.reportedAt = reportedAt;
        this.resolvedAt = resolvedAt;
        this.status = status;
        this.repairRecordId = repairRecordId;
    }

    /** ¿Sigue pendiente de reparación? */
    get pending(): boolean {
        return this.status === IncidentStatus.REPORTED;
    }

    /** Copia del incidente ya reparado: con su fecha de resolución y el mantenimiento que lo reparó. */
    withResolution(resolvedAt: string, repairRecordId: number): DroneIncident {
        return new DroneIncident(this.id, this.droneId, this.description, this.reportedAt,
            resolvedAt, IncidentStatus.RESOLVED, repairRecordId);
    }
}