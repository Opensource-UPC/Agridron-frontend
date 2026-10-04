import {Routes} from '@angular/router';

/**
 * Rutas de las vistas de inventario y recursos.
 */
export const inventoryAndResourceManagementRoutes: Routes = [
    {path: '', loadComponent: () => import('./components/drone-page/drone-page').then(m => m.DronePage)},
];