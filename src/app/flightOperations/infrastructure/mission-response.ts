/**
 * Resource representation of a mission returned by the API.
 */
import {BaseResource, BaseResponse} from "../../shared/infrastructure/base-response";
import {MissionStatus} from "../domain/model/mission-status.enum";


export interface MissionResource extends BaseResource {
    id: number;
    requestedDate: string;
    parcelId: number;
    agrochemicalId: number;
    droneId: number;
    operatorId: number;
    flightHeight: number | null;
    flightSpeed: number | null;
    sprayRate: number | null;
    overlap: number | null;
    status: MissionStatus;
}

export interface MissionResponse extends BaseResponse {
    missions: MissionResource[];
}

export interface MissionResultResource extends MissionResource {
    id: number;
    missionId: number;
    treatedArea: number | null;
    appliedVolume: number | null;
    observations: string | null;
}

export interface MissionResultResponse extends BaseResponse {
    missionResults: MissionResultResource[];
}

export interface IncidentResource extends BaseResource {
    id: number;
    missionId: number;
    type: string | null;
    description: string | null;
    reportedAt: string;
}

export interface IncidentResponse extends BaseResponse {
    incidents: IncidentResource[];
}

export interface OperationStatusResource extends BaseResource {
    id: number;
    missionId: number;
    status: string;
    reportedAt: string;
}

export interface OperationStatusResponse extends BaseResponse {
    operationStatuses: OperationStatusResource[];
}
