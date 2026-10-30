import {HttpClient} from "@angular/common/http";
import {DronAssembler} from "../app/InventoryResourceManagement/infrastructure/dron-assembler";

export const environment = {
  production: false,
  AgriDronProviderApiBaseUrl: 'http://localhost:3000/api/v1',
  AgriDronProviderProductsEndpointPath: '/products',
  AgriDronProviderCartsEndpointPath: '/carts',
  AgriDronProviderUsersEndpointPath: '/users',
  AgriDronProviderFarmsEndpointPath: '/farms',
  AgriDronProviderParcelsEndpointPath: '/parcels',
  AgriDronProviderFumigationAreasEndpointPath: '/fumigation-areas',
  AgriDronProviderCropsEndpointPath: '/crops',
  AgriDronProviderMissionReportsEndpointPath: '/mission-reports',
  AgriDronProviderMissionHistoriesEndpointPath: '/mission-histories',
  AgriDronProviderOperationalMetricsEndpointPath: '/operational-metrics',
  AgriDronProviderPerformanceIndicatorsEndpointPath: '/performance-indicators',
  weatherApiBaseUrl: 'http://localhost:3000/api/v1',
  weatherEndpointPath: '/weather',

////De Edwin
  AgriDronProviderDronesMetricsEndpointPath: '/drones',
  AgriDronProvideChemicalsEndpointPath: '/agrochemicals',
  AgriDronProvideNozzlesEndpointPath: '/nozzles',
  AgriDronProvideMaintenanceRecordEndpointPath: '/maintenance-records',
};



