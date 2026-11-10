import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Mission} from '../domain/model/mission.entity';
import {MissionResult} from '../domain/model/mission-result.entity';
import {Incident} from '../domain/model/incident.entity';
import {OperationStatus} from '../domain/model/operation-status.entity';
import {MissionApiEndpoint} from './mission-api-endpoint';
import {MissionResultApiEndpoint} from './mission-result-api-endpoint';
import {IncidentApiEndpoint} from './incident-api-endpoint';
import {OperationStatusApiEndpoint} from './operation-status-api-endpoint';

/**
 * Infrastructure facade for mission, mission result, incident and operation status endpoint operations.
 */
@Injectable({providedIn: 'root'})
export class FlightOperationsApi extends BaseApi {
    private readonly http = inject(HttpClient);
    private readonly missionEndpoint = new MissionApiEndpoint(this.http);
    private readonly missionResultEndpoint = new MissionResultApiEndpoint(this.http);
    private readonly incidentEndpoint = new IncidentApiEndpoint(this.http);
    private readonly operationStatusEndpoint = new OperationStatusApiEndpoint(this.http);

    /**
     * Retrieves all missions.
     * @returns Stream with the mission collection.
     */
    getAllMissions = (): Observable<Mission[]> =>
        this.missionEndpoint.getAll();

    /**
     * Retrieves a single mission by ID.
     * @param id - The ID of the mission.
     * @returns Stream with the mission.
     */
    getMissionById = (id: number): Observable<Mission> =>
        this.missionEndpoint.getById(id);

    /**
     * Creates a new mission.
     * @param mission - The mission to create.
     * @returns Stream with the created mission.
     */
    createMission = (mission: Mission): Observable<Mission> =>
        this.missionEndpoint.create(mission);

    /**
     * Updates an existing mission.
     * @param mission - The mission to update.
     * @returns Stream with the updated mission.
     */
    updateMission = (mission: Mission): Observable<Mission> =>
        this.missionEndpoint.update(mission, mission.id);

    /**
     * Deletes a mission by ID.
     * @param id - The ID of the mission to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteMission = (id: number): Observable<void> =>
        this.missionEndpoint.delete(id);

    /**
     * Retrieves all mission results.
     * @returns Stream with the mission result collection.
     */
    getAllMissionResults = (): Observable<MissionResult[]> =>
        this.missionResultEndpoint.getAll();

    /**
     * Retrieves a single mission result by ID.
     * @param id - The ID of the mission result.
     * @returns Stream with the mission result.
     */
    getMissionResultById = (id: number): Observable<MissionResult> =>
        this.missionResultEndpoint.getById(id);

    /**
     * Creates a new mission result.
     * @param missionResult - The mission result to create.
     * @returns Stream with the created mission result.
     */
    createMissionResult = (missionResult: MissionResult): Observable<MissionResult> =>
        this.missionResultEndpoint.create(missionResult);

    /**
     * Updates an existing mission result.
     * @param missionResult - The mission result to update.
     * @returns Stream with the updated mission result.
     */
    updateMissionResult = (missionResult: MissionResult): Observable<MissionResult> =>
        this.missionResultEndpoint.update(missionResult, missionResult.id);

    /**
     * Deletes a mission result by ID.
     * @param id - The ID of the mission result to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteMissionResult = (id: number): Observable<void> =>
        this.missionResultEndpoint.delete(id);

    /**
     * Retrieves all incidents.
     * @returns Stream with the incident collection.
     */
    getAllIncidents = (): Observable<Incident[]> =>
        this.incidentEndpoint.getAll();

    /**
     * Retrieves a single incident by ID.
     * @param id - The ID of the incident.
     * @returns Stream with the incident.
     */
    getIncidentById = (id: number): Observable<Incident> =>
        this.incidentEndpoint.getById(id);

    /**
     * Creates a new incident.
     * @param incident - The incident to create.
     * @returns Stream with the created incident.
     */
    createIncident = (incident: Incident): Observable<Incident> =>
        this.incidentEndpoint.create(incident);

    /**
     * Updates an existing incident.
     * @param incident - The incident to update.
     * @returns Stream with the updated incident.
     */
    updateIncident = (incident: Incident): Observable<Incident> =>
        this.incidentEndpoint.update(incident, incident.id);

    /**
     * Deletes an incident by ID.
     * @param id - The ID of the incident to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteIncident = (id: number): Observable<void> =>
        this.incidentEndpoint.delete(id);

    /**
     * Retrieves all operation statuses.
     * @returns Stream with the operation status collection.
     */
    getAllOperationStatuses = (): Observable<OperationStatus[]> =>
        this.operationStatusEndpoint.getAll();

    /**
     * Retrieves a single operation status by ID.
     * @param id - The ID of the operation status.
     * @returns Stream with the operation status.
     */
    getOperationStatusById = (id: number): Observable<OperationStatus> =>
        this.operationStatusEndpoint.getById(id);

    /**
     * Creates a new operation status.
     * @param operationStatus - The operation status to create.
     * @returns Stream with the created operation status.
     */
    createOperationStatus = (operationStatus: OperationStatus): Observable<OperationStatus> =>
        this.operationStatusEndpoint.create(operationStatus);

    /**
     * Updates an existing operation status.
     * @param operationStatus - The operation status to update.
     * @returns Stream with the updated operation status.
     */
    updateOperationStatus = (operationStatus: OperationStatus): Observable<OperationStatus> =>
        this.operationStatusEndpoint.update(operationStatus, operationStatus.id);

    /**
     * Deletes an operation status by ID.
     * @param id - The ID of the operation status to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteOperationStatus = (id: number): Observable<void> =>
        this.operationStatusEndpoint.delete(id);
}