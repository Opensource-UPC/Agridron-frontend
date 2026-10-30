import {BaseApiEndpoint} from "../../shared/infrastructure/base-api-endpoint";
import {OperationStatus} from "../domain/model/operation-status.entity";
import {OperationStatusResource, OperationStatusResponse} from "./flight-operations-response";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {OperationStatusAssembler} from "./operation-status-assembler";

export class OperationStatusApiEndpoint extends BaseApiEndpoint<OperationStatus, OperationStatusResource, OperationStatusResponse, OperationStatusAssembler> {
    /**
     * Creates an instance of OperationStatusApiEndpoint.
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(
            http,
            `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProviderOperationStatusesEndpointPath}`,
            new OperationStatusAssembler()
        );
    }
}
