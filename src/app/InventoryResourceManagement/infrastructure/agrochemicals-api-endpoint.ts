import {HttpClient} from "@angular/common/http";
import {BaseApiEndpoint} from "../../shared/infrastructure/base-api-endpoint";
import {Agrochemicals} from "../domain/model/agrochemical.entity";
import {AgrochemicalResource, AgrochemicalsResponse} from "./inventory-and-resource-management-response";
import {AgrochemicalsAssembler} from "./agrochemicals-assembler";
import {environment} from "../../../environments/environment";

export class AgrochemicalsApiEndpoint extends  BaseApiEndpoint <
      Agrochemicals, AgrochemicalResource, AgrochemicalsResponse, AgrochemicalsAssembler>{

    /**
     * Creates an instance of AgrochemicalEndpoint
     * @param http - The HttpClient to be used for making API requests.
     */
    constructor(http: HttpClient) {
        super(http, `${environment.AgriDronProviderApiBaseUrl}${environment.AgriDronProvideChemicalsEndpointPath}`, new AgrochemicalsAssembler());
    }
}