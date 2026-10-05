import{BaseResource, BaseResponse} from "../../shared/infrastructure/base-response";


/**
 * describe a dron from endpoint
 */
export interface DroneResource extends BaseResource {
    id: number;
    serialNumber: string;
    model: string;
    batteryLevel: number;
    status: string;
    nozzleId: number;
    lastMaintenanceDate: string;
    nextMaintenanceDate: string;
    urlimg: string;
}

/**
 * describe a list of drones
 */
export interface DroneResponse extends BaseResponse {
    drones: DroneResource[];
}


/**
 * describe  Agrochemical from endpoint
 */
export interface AgrochemicalResource extends BaseResource {

    id:number;
    name: string;
    type: string;
    stockLiters: number;
    minimumStockLiters: number;
    expirationDate: string;
}

/**
 * describe a list of agrochemicals
 */
export interface AgrochemicalsResponse extends BaseResponse {
    Agrochemicals: AgrochemicalResource[];
}


export interface NozzleResource extends BaseResource {
    id: number;
    type: string;
    diameterMm: number;
    stockUnits: number;
    status: string;
}

/**
 * Describes a list of nozzles
 */
export interface NozzlesResponse extends BaseResponse {
    nozzles: NozzleResource[];
}



export interface MaintenanceRecordResource extends BaseResource {
    id: number;
    droneId: number;
    date: string;
    type: string;
    description: string;
    technician: string;
}

export interface MaintenanceRecordsResponse extends BaseResponse {
    maintenanceRecords: MaintenanceRecordResource[];
}