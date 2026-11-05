/**
 * Aqui es donde se consume el assembler, usando el http
 */
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {MaintenanceRecord} from "../domain/model/maintance-records.entity";
import {MaintenanceRecordResource,MaintenanceRecordsResponse} from "./inventory-and-resource-management-response";
import {MaintenanceRecordAssembler} from "./maintenanceRecords-assembler";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for dron CRUD operations.
 */
export class MaintenanceRecordsApiEndpoint extends BaseApiEndpoint<MaintenanceRecord,MaintenanceRecordResource,MaintenanceRecordsResponse ,MaintenanceRecordAssembler> {
    /**
     * Creates an instance of MaintenanceRecord.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProvideMaintenanceRecordEndpointPath}`, new MaintenanceRecordAssembler());
    }

    /**
     * Crea un registro SIN enviar el id: el servidor (json-server) lo asigna solo.
     */
    override create(entity: MaintenanceRecord): Observable<MaintenanceRecord> {
        const {id, ...resource} = this.assembler.toResourceFromEntity(entity);
        return this.http.post<MaintenanceRecordResource>(this.endpointUrl, resource).pipe(
            map(created => this.assembler.toEntityFromResource(created)),
            catchError(this.handleError('Failed to create maintenance record'))
        );
    }
}