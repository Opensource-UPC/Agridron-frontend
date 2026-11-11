import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {FumigationArea} from '../domain/model/fumigationArea.entity';
import {FumigationAreaResource, FumigationAreaResponse} from './field-management-response';
import {FumigationAreaAssembler} from './fumigation-area-assembler';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for fumigation area CRUD operations.
 */
export class FumigationAreaApiEndpoint extends BaseApiEndpoint<FumigationArea, FumigationAreaResource, FumigationAreaResponse, FumigationAreaAssembler> {
    /**
     * Creates an instance of FumigationAreaApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderFumigationAreasEndpointPath}`, new FumigationAreaAssembler());
    }

    /**
     * Fetches the fumigation areas delimited inside a parcel.
     *
     * <p>The backend requires the {@code parcelId} query parameter, so this endpoint cannot
     * reuse the generic {@code getAll()} implementation.</p>
     *
     * @param parcelId - Identifier of the parcel whose areas are requested.
     * @returns Stream with the mapped fumigation area collection.
     */
    getByParcel(parcelId: number): Observable<FumigationArea[]> {
        return this.http
            .get<FumigationAreaResource[] | FumigationAreaResponse>(this.endpointUrl, {
                params: new HttpParams().set('parcelId', parcelId)
            })
            .pipe(
                map(response => Array.isArray(response)
                    ? response.map(resource => this.assembler.toEntityFromResource(resource))
                    : this.assembler.toEntitiesFromResponse(response)),
                catchError(this.handleError('Failed to fetch fumigation areas'))
            );
    }
}
