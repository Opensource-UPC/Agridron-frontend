
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Drone} from "../domain/model/drone.entity";
import {DroneResource, DroneResponse} from "./inventory-and-resource-management-response";
import {DronAssembler} from "./dron-assembler";
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for dron CRUD operations.
 */
export class DronApiEndpoint extends BaseApiEndpoint<Drone, DroneResource, DroneResponse, DronAssembler> {
    /**
     * Creates an instance of DroneApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderDronesMetricsEndpointPath}`, new DronAssembler());
    }
}
