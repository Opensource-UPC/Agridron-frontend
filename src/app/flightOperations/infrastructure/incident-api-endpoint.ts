import {BaseApiEndpoint} from "../../shared/infrastructure/base-api-endpoint";
import {Incident} from "../domain/model/incident.entity";
import {IncidentResource, IncidentResponse} from "./flight-operations-response";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {IncidentAssembler} from "./incident-assembler";

export class IncidentApiEndpoint extends BaseApiEndpoint<Incident, IncidentResource, IncidentResponse, IncidentAssembler> {
    /**
     * Creates an instance of IncidentApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(
            http,
            `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderIncidentsEndpointPath}`,
            new IncidentAssembler()
        );
    }
}
