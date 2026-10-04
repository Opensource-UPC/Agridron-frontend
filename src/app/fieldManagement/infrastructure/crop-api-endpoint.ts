import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Crop} from '../domain/model/crop.entity';
import {CropResource, CropResponse} from './field-management-response';
import {CropAssembler} from './crop-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for crop CRUD operations.
 */
export class CropApiEndpoint extends BaseApiEndpoint<Crop, CropResource, CropResponse, CropAssembler> {
    /**
     * Creates an instance of CropApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderCropsEndpointPath}`, new CropAssembler());
    }
}
