export const environment = {
  production: true,
  AgriDronProviderApiBaseUrl: 'http://api-gateway',

  /**
   * 🟢 BACKEND REAL (40%): Endpoints desplegados en Spring Boot.
   * Cambia esta URL por la URL real de tu backend desplegado en Render u otro servicio.
   */
  realBackendApiUrl: 'https://agridron-backend.onrender.com/api/v1',

  /**
   * 🟡 FAKE API (60%): Endpoints simulados (Misiones, IAM/Usuarios, etc.).
   */
  fakeApiUrl: 'https://agridron-mock-api.onrender.com',

  AgriDronProviderProductsEndpointPath: '/products',
  AgriDronProviderCartsEndpointPath: '/carts',
  AgriDronProviderUsersEndpointPath: '/users',
  reverseGeocodingUrl: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
  /** Weather simulator (debug panel) on Home. Keep false in production. */
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
  AgriDronProvideChemicalsEndpointPath: '/chemicals',
  AgriDronProvideNozzlesEndpointPath: '/nozzles',
  AgriDronProvideMaintenanceRecordEndpointPath: '/maintenance-records',
  AgriDronProviderDroneIncidentsEndpointPath: '/drone-incidents',

  AgriDronProviderMissionsEndpointPath: '/missions',
  AgriDronProviderMissionResultsEndpointPath: '/mission-results',
  AgriDronProviderIncidentsEndpointPath: '/incidents',
  AgriDronProviderOperationStatusesEndpointPath: '/operation-status',
};
