/**
 * Aqui es donde se consume el assembler, usando el http
 */
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {MaintenanceRecord} from "../domain/model/maintance-records.entity";
import {MaintenanceRecordResource,MaintenanceRecordsResponse} from "./inventory-and-resource-management-response";
import {MaintenanceRecordAssembler} from "./maintenanceRecords-assembler";
import {HttpClient} from '@angular/common/http';
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
}

