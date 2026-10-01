import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Farm} from '../domain/model/farm.entity';
import {FarmResource, FarmResponse} from './field-management-response';
import {FarmAssembler} from './farm-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for farm CRUD operations.
 */
export class FarmApiEndpoint extends BaseApiEndpoint<Farm, FarmResource, FarmResponse, FarmAssembler> {
    /**
     * Creates an instance of FarmApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderFarmsEndpointPath}`, new FarmAssembler());
    }
}
