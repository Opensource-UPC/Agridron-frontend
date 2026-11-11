import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Endpoints implementados en el Backend Real (Spring Boot - 40%).
 */
const REAL_BACKEND_ROUTES = [
  '/farms',
  '/parcels',
  '/fumigation-areas',
  '/crops',
  '/drones',
  '/nozzles',
  '/mission-histories',
  '/mission-reports',
  '/performance-indicators',
  '/status'
];

/**
 * Interceptor Híbrido:
 * - Desvía las peticiones del 40% (Fincas, Parcelas, Drones, Reportes) al Backend Real en Spring Boot.
 * - Desvía el resto (Autenticación, Misiones, Agroquímicos, Incidentes) al Fake API / Mock.
 * - Adapta parámetros requeridos por Spring Boot (como ownerId o polígonos GeoJSON).
 */
export const hybridApiInterceptor: HttpInterceptorFn = (req, next) => {
  // Ignorar llamadas a APIs de terceros y assets locales (locales, iconos SVG, etc.)
  if (
    req.url.startsWith('./') ||
    req.url.includes('open-meteo.com') ||
    req.url.includes('bigdatacloud.net')
  ) {
    return next(req);
  }

  // Identificar si la llamada usa la URL base administrada de AgriDron
  const basePrefix = environment.AgriDronProviderApiBaseUrl;
  const isAgriDronRequest = req.url.startsWith(basePrefix);

  if (!isAgriDronRequest) {
    return next(req);
  }

  // Extraer el path relativo (ej: /farms, /missions)
  const relativePath = req.url.substring(basePrefix.length);

  // Verificar si la ruta pertenece al 40% del Backend Real
  const isReal = REAL_BACKEND_ROUTES.some(route => relativePath.startsWith(route));

  // Seleccionar la URL base destino
  const targetBase = (isReal ? environment.realBackendApiUrl : environment.fakeApiUrl).replace(/\/+$/, '');
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  const resolvedUrl = `${targetBase}${cleanPath}`;

  let modifiedReq = req.clone({ url: resolvedUrl });

  // Adaptaciones automáticas para cumplir con las validaciones de Spring Boot:
  if (isReal) {
    const isCollection = (path: string, method: string) => cleanPath === path && req.method === method;
    const isItem = (path: string, method: string) =>
      new RegExp(`^${path}/\\d+$`).test(cleanPath) && req.method === method;
    const parseGeometry = (value: unknown): unknown => {
      if (typeof value !== 'string') return value;
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    // 1. GET /farms: Spring Boot requiere @RequestParam Long ownerId
    const isFarmsList = (cleanPath === '/farms' || cleanPath.startsWith('/farms?')) && req.method === 'GET';
    if (isFarmsList && !req.params.has('ownerId')) {
      const storedUser = localStorage.getItem('user');
      let ownerId = '1';
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed.id) ownerId = String(parsed.id);
        } catch {
          // fallback a 1
        }
      }
      modifiedReq = modifiedReq.clone({
        params: req.params.set('ownerId', ownerId)
      });
    }

    // 2. POST/PUT /farms: Spring Boot requiere name, location, department y ownerId positivo
    if ((isCollection('/farms', 'POST') || isItem('/farms', 'PUT')) && req.body && typeof req.body === 'object') {
      const body = { ...(req.body as Record<string, unknown>) };
      if (!body['department']) {
        const loc = String(body['location'] || '');
        body['department'] = loc.includes(',') ? loc.split(',')[0].trim() : 'Lima';
      }
      if (isCollection('/farms', 'POST') && (!body['ownerId'] || Number(body['ownerId']) <= 0)) {
        const storedUser = localStorage.getItem('user');
        body['ownerId'] = storedUser ? JSON.parse(storedUser).id || 1 : 1;
      }
      delete body['id'];
      modifiedReq = modifiedReq.clone({ body });
    }

    // 3. POST/PUT /parcels: Spring Boot requiere geometry como objeto GeoJSON y
    //    phenologicalStage cuando hay cropId
    if ((isCollection('/parcels', 'POST') || isItem('/parcels', 'PUT')) && req.body && typeof req.body === 'object') {
      const body = { ...(req.body as Record<string, unknown>) };
      body['geometry'] = parseGeometry(body['geometry']);
      if (body['cropId'] && !body['phenologicalStage']) {
        body['phenologicalStage'] = 'VEGETATIVE';
      }
      if (!body['cropId']) {
        delete body['cropId'];
        delete body['phenologicalStage'];
      }
      delete body['id'];
      delete body['area'];
      delete body['areaHectares'];
      if (isItem('/parcels', 'PUT')) {
        delete body['farmId'];
      }
      modifiedReq = modifiedReq.clone({ body });
    }

    // 4. POST/PUT /fumigation-areas: Spring Boot espera la geometría como objeto y,
    //    en la actualización, el cuerpo es directamente el GeoJSON del polígono
    if (isCollection('/fumigation-areas', 'POST') && req.body && typeof req.body === 'object') {
      const body = { ...(req.body as Record<string, unknown>) };
      body['geometry'] = parseGeometry(body['geometry']);
      delete body['id'];
      delete body['area'];
      delete body['areaHectares'];
      modifiedReq = modifiedReq.clone({ body });
    }

    if (isItem('/fumigation-areas', 'PUT') && req.body && typeof req.body === 'object') {
      const body = req.body as Record<string, unknown>;
      const geometry = parseGeometry(body['geometry'] ?? body);
      modifiedReq = modifiedReq.clone({ body: geometry });
    }
  }

  // Log visual con estilos para demostrar la interacción en vivo en la consola de la presentación
  const tag = isReal ? '%c[BACKEND REAL 40%]' : '%c[FAKE API 60%]';
  const tagStyle = isReal
    ? 'background: #047857; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: bold;'
    : 'background: #d97706; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-weight: bold;';

  console.log(tag, tagStyle, `${req.method} -> ${modifiedReq.urlWithParams}`);

  return next(modifiedReq);
};
