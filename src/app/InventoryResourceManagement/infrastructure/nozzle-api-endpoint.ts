/**
 * Aqui es donde se consume el assembler, usando el http
 */
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Nozzle} from "../domain/model/nozzle.entity";
import {NozzleResource, NozzlesResponse} from "./inventory-and-resource-management-response";
import {NozzleAssembler} from "./nozzle-assembler";
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for dron CRUD operations.
 */
export class NozzleApiEndpoint extends BaseApiEndpoint<Nozzle,NozzleResource,NozzlesResponse , NozzleAssembler> {
    /**
     * Creates an instance of DroneApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderDronesMetricsEndpointPath}`, new NozzleAssembler());
    }
}



