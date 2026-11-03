

import {Routes} from '@angular/router';

/**
 * Rutas de la sección "Agroquímicos" (DR-003), separada de la flota de drones.
 */
export const agrochemicalRoutes: Routes = [
    {
        path: '', loadComponent: () =>
            import('./components/agrochemical-page/agrochemical-page')
                .then(m => m.AgrochemicalPage)
    }
];