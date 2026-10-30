
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Drone} from "../domain/model/drone.entity";
import {DroneResource, DroneResponse} from "./inventory-and-resource-management-response";
import {DronAssembler} from "./dron-assembler";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for dron CRUD operations.
 */
export class DronApiEndpoint extends BaseApiEndpoint<Drone, DroneResource, DroneResponse, DronAssembler> {
    /**
     * Creates an instance of DroneApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     * BASICAMENTE LO QUE HACE ES ARMAR SU PROPIA URL Y COMO HEREDA DE BASEAPIENDPOINT PUES...YA TIENE LAS OPERACIONES CRUD.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderDronesMetricsEndpointPath}`, new DronAssembler());
    }

    /**
     * Crea un dron SIN enviar el id: el servidor (json-server) lo asigna solo.
     */
    override create(entity: Drone): Observable<Drone> {
        const {id, ...resource} = this.assembler.toResourceFromEntity(entity);
        return this.http.post<DroneResource>(this.endpointUrl, resource).pipe(
            map(created => this.assembler.toEntityFromResource(created)),
            catchError(this.handleError('Failed to create drone'))
        );
    }

}
