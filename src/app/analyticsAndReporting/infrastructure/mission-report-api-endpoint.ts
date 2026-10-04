import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {MissionReport} from '../domain/model/mission-report.entity';
import {MissionReportResource, MissionReportResponse} from './analytics-and-reporting-response';
import {MissionReportAssembler} from './mission-report-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for mission report CRUD operations.
 */
export class MissionReportApiEndpoint extends BaseApiEndpoint<MissionReport, MissionReportResource, MissionReportResponse, MissionReportAssembler> {
    /**
     * Creates an instance of MissionReportApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderMissionReportsEndpointPath}`, new MissionReportAssembler());
    }
}
