/**
 * Aqui es donde se consume el assembler, usando el http
 */
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Nozzle} from "../domain/model/nozzle.entity";
import {NozzleResource, NozzlesResponse} from "./inventory-and-resource-management-response";
import {NozzleAssembler} from "./nozzle-assembler";
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
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
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProvideNozzlesEndpointPath}`, new NozzleAssembler());
    }


    /**
     * Crea una boquilla SIN enviar el id: el servidor (json-server) lo asigna solo.
     */
    override create(entity: Nozzle): Observable<Nozzle> {
        const {id, ...resource} = this.assembler.toResourceFromEntity(entity);
        return this.http.post<NozzleResource>(this.endpointUrl, resource).pipe(
            map(created => this.assembler.toEntityFromResource(created)),
            catchError(this.handleError('Failed to create nozzle'))
        );
    }
}



