import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {OperationalMetric} from '../domain/model/operational-metric.entity';
import {OperationalMetricResource, OperationalMetricResponse} from './analytics-and-reporting-response';
import {OperationalMetricAssembler} from './operational-metric-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for operational metric CRUD operations.
 */
export class OperationalMetricApiEndpoint extends BaseApiEndpoint<OperationalMetric, OperationalMetricResource, OperationalMetricResponse, OperationalMetricAssembler> {
    /**
     * Creates an instance of OperationalMetricApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderOperationalMetricsEndpointPath}`, new OperationalMetricAssembler());
    }
}
