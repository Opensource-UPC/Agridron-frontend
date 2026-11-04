import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {DroneIncident} from '../domain/model/drone-incident.entity';
import {DroneIncidentResource, DroneIncidentsResponse} from './inventory-and-resource-management-response';
import {DroneIncidentAssembler} from './drone-incident-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for drone incident operations.
 */
export class DroneIncidentApiEndpoint extends BaseApiEndpoint<
    DroneIncident, DroneIncidentResource, DroneIncidentsResponse, DroneIncidentAssembler> {

    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProvideIncidentsEndpointPath}`, new DroneIncidentAssembler());
    }

    /**
     * Crea un incidente SIN enviar el id: el servidor (json-server) lo asigna solo.
     */
    override create(entity: DroneIncident): Observable<DroneIncident> {
        const {id, ...resource} = this.assembler.toResourceFromEntity(entity);
        return this.http.post<DroneIncidentResource>(this.endpointUrl, resource).pipe(
            map(created => this.assembler.toEntityFromResource(created)),
            catchError(this.handleError('Failed to create drone incident'))
        );
    }
}