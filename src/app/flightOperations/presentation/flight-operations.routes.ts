import {Routes} from '@angular/router';

/**
 * Route tree for flight operations presentation views.
 */
export const flightOperationsRoutes: Routes = [
    { path: 'missions',                     loadComponent: () => import('./views/mission-list/mission-list').then(m => m.MissionList) },
    { path: 'missions/new',                 loadComponent: () => import('./views/mission-form/mission-form').then(m => m.MissionForm) },
    { path: 'missions/:id/edit',            loadComponent: () => import('./views/mission-form/mission-form').then(m => m.MissionForm) },
    { path: 'missions/:id/weather-warning', loadComponent: () => import('./views/mission-weather-warning/mission-weather-warning').then(m => m.MissionWeatherWarning) },
    { path: 'missions/:id/paused',          loadComponent: () => import('./views/mission-paused/mission-paused').then(m => m.MissionPaused) },
    { path: 'missions/:id/incident',        loadComponent: () => import('./views/incident-form/incident-form').then(m => m.IncidentForm) },
    { path: 'missions/:id/complete',        loadComponent: () => import('./views/mission-complete/mission-complete').then(m => m.MissionComplete) },
    { path: 'missions/:id',                 loadComponent: () => import('./views/mission-detail/mission-detail').then(m => m.MissionDetail) }
];