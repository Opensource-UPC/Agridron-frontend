import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {BaseApiEndpoint} from "../../shared/infrastructure/base-api-endpoint";
import {Agrochemicals} from "../domain/model/agrochemical.entity";
import {AgrochemicalResource, AgrochemicalsResponse} from "./inventory-and-resource-management-response";
import {AgrochemicalsAssembler} from "./agrochemicals-assembler";
import {environment} from "../../../environments/environment";

export class AgrochemicalsApiEndpoint extends BaseApiEndpoint<
    Agrochemicals, AgrochemicalResource, AgrochemicalsResponse, AgrochemicalsAssembler> {

    /**
     * Creates an instance of AgrochemicalEndpoint
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProvideChemicalsEndpointPath}`, new AgrochemicalsAssembler());
    }

    /**
     * Crea un agroquímico SIN enviar el id: el servidor lo asigna solo.
     */
    override create(entity: Agrochemicals): Observable<Agrochemicals> {
        const {id, ...resource} = this.assembler.toResourceFromEntity(entity);
        return this.http.post<AgrochemicalResource>(this.endpointUrl, resource).pipe(
            map(created => this.assembler.toEntityFromResource(created)),
            catchError(this.handleError('Failed to create agrochemical'))
        );
    }
}