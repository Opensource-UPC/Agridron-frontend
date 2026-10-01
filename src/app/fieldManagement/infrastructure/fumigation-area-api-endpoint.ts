import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {FumigationArea} from '../domain/model/fumigationArea.entity';
import {FumigationAreaResource, FumigationAreaResponse} from './field-management-response';
import {FumigationAreaAssembler} from './fumigation-area-assembler';
import {HttpClient} from '@angular/common/http';
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
}
