import {BaseApiEndpoint} from "../../shared/infrastructure/base-api-endpoint";
import {MissionResult} from "../domain/model/mission-result.entity";
import {MissionResultResource, MissionResultResponse} from "./flight-operations-response";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MissionResultAssembler} from "./mission-result-assembler";

export class MissionResultApiEndpoint extends BaseApiEndpoint<MissionResult, MissionResultResource, MissionResultResponse, MissionResultAssembler> {
    /**
     * Creates an instance of MissionResultApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(
            http,
            `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderMissionResultsEndpointPath}`,
            new MissionResultAssembler()
        );
    }
}
