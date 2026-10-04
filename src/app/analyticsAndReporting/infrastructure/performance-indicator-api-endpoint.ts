import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {PerformanceIndicator} from '../domain/model/performance-indicator.entity';
import {PerformanceIndicatorResource, PerformanceIndicatorResponse} from './analytics-and-reporting-response';
import {PerformanceIndicatorAssembler} from './performance-indicator-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for performance indicator CRUD operations.
 */
export class PerformanceIndicatorApiEndpoint extends BaseApiEndpoint<PerformanceIndicator, PerformanceIndicatorResource, PerformanceIndicatorResponse, PerformanceIndicatorAssembler> {
    /**
     * Creates an instance of PerformanceIndicatorApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderPerformanceIndicatorsEndpointPath}`, new PerformanceIndicatorAssembler());
    }
}
