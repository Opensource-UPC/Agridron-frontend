export const environment = {
  production: true,
  AgriDronProviderApiBaseUrl: 'https://6ac44bc6ae53bf25b80f549f.mockapi.io',
  ///AgriDronProviderApiBaseUrl: 'http://localhost:3000/api/v1',
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
  // TODO: Replace with real weather API (cannot use localhost in production)
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