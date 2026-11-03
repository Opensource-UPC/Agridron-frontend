import {HttpClient} from "@angular/common/http";
import {DronAssembler} from "../app/InventoryResourceManagement/infrastructure/dron-assembler";

export const environment = {
  production: false,
  AgriDronProviderApiBaseUrl: 'http://localhost:3000/api/v1',
  AgriDronProviderProductsEndpointPath: '/products',
  AgriDronProviderCartsEndpointPath: '/carts',
  AgriDronProviderUsersEndpointPath: '/users',
  reverseGeocodingUrl: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
  /** Weather simulator (debug panel) on Home. true = sliders to test the weather alerts locally, false = real data only. */
  debugMode: false,
  AgriDronProviderFarmsEndpointPath: '/farms',
  AgriDronProviderParcelsEndpointPath: '/parcels',
  AgriDronProviderFumigationAreasEndpointPath: '/fumigation-areas',
  AgriDronProviderCropsEndpointPath: '/crops',
  AgriDronProviderMissionReportsEndpointPath: '/mission-reports',
  AgriDronProviderMissionHistoriesEndpointPath: '/mission-histories',
  AgriDronProviderOperationalMetricsEndpointPath: '/operational-metrics',
  AgriDronProviderPerformanceIndicatorsEndpointPath: '/performance-indicators',
  weatherApiBaseUrl: 'https://api.open-meteo.com',
  weatherEndpointPath: '/v1/forecast',

////De Edwin
  AgriDronProviderDronesMetricsEndpointPath: '/drones',
  AgriDronProvideChemicalsEndpointPath: '/agrochemicals',
  AgriDronProvideNozzlesEndpointPath: '/nozzles',
  AgriDronProvideMaintenanceRecordEndpointPath: '/maintenance',

  AgriDronProviderMissionsEndpointPath: '/missions',
  AgriDronProviderMissionResultsEndpointPath: '/mission-results',
  AgriDronProviderIncidentsEndpointPath: '/incidents',
  AgriDronProviderOperationStatusesEndpointPath: '/operation-status',
};
