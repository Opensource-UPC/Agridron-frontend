export const environment = {
  production: true,
  // TODO: Replace with real backend API URL when available
  // MockAPI free tier only supports 2 endpoints (farms, users)
  AgriDronProviderApiBaseUrl: 'https://6ac44bc6ae53bf25b80f549f.mockapi.io',
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
  // TODO: Replace with real weather API (cannot use localhost in production)
  weatherApiBaseUrl: 'https://api.open-meteo.com',
  weatherEndpointPath: '/v1/forecast',

  ////De Edwin
  AgriDronProviderDronesMetricsEndpointPath: '/drones',
  AgriDronProvideChemicalsEndpointPath: '/chemicals',
  AgriDronProvideNozzlesEndpointPath: '/nozzles',
  AgriDronProvideMaintenanceRecordEndpointPath: '/maintenance',
};