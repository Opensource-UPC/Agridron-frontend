import {BaseApiEndpoint} from "../../shared/infrastructure/base-api-endpoint";
import {Mission} from "../domain/model/mission.entity";
import {MissionResource, MissionResponse} from "./flight-operations-response";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {MissionAssembler} from "./mission-assembler";

export class MissionApiEndpoint extends BaseApiEndpoint<Mission, MissionResource, MissionResponse, MissionAssembler> {
    /**
     * Creates an instance of MissionApiEndpoint.
     */
    constructor(http: HttpClient) {
        super(
            http,
            `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderMissionsEndpointPath}`,
            new MissionAssembler()
        );
    }
}