import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Parcel} from '../domain/model/parcel.entity';
import {ParcelResource, ParcelResponse} from './field-management-response';
import {ParcelAssembler} from './parcel-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for parcel CRUD operations.
 */
export class ParcelApiEndpoint extends BaseApiEndpoint<Parcel, ParcelResource, ParcelResponse, ParcelAssembler> {
    /**
     * Creates an instance of ParcelApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderParcelsEndpointPath}`, new ParcelAssembler());
    }
}
