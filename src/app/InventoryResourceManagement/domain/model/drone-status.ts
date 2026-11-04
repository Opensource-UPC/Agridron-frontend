/**
 * Represent a status operative of one dron
 */
export enum DroneStatus {
    AVAILABLE = 'available',
    IN_FLIGHT = 'in-flight',
    MAINTENANCE = 'maintenance',
    OUT_OF_SERVICE = 'out-of-service'
}

export const DRONE_STATUSES: readonly DroneStatus[] = Object.values(DroneStatus);
