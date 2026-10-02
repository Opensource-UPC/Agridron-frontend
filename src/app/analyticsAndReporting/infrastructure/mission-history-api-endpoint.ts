import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {MissionHistory} from '../domain/model/mission-history.entity';
import {MissionHistoryResource, MissionHistoryResponse} from './analytics-and-reporting-response';
import {MissionHistoryAssembler} from './mission-history-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for mission history CRUD operations.
 */
export class MissionHistoryApiEndpoint extends BaseApiEndpoint<MissionHistory, MissionHistoryResource, MissionHistoryResponse, MissionHistoryAssembler> {
    /**
     * Creates an instance of MissionHistoryApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderMissionHistoriesEndpointPath}`, new MissionHistoryAssembler());
    }
}
