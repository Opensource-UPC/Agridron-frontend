import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

/**
 * Devuelve la clave de traducción del motivo del error, o null si no se conoce.
 * (BaseApiEndpoint arma los mensajes de error en inglés; aquí se reconocen.)
 */
const errorReasonKey = (error: unknown): string | null => {
    if (error instanceof Error) {
        if (error.message.includes('Resource not found')) return 'errors.notFound';
        if (error.message.includes('Unknown Error')) return 'errors.network';
    }
    return null;
};

/**
 * Arma el mensaje de error ya traducido ("operación: motivo").
 * Usa translate.get(), que espera a que el archivo de idioma termine de cargar:
 * así el mensaje sale traducido aunque el error ocurra al arrancar la app.
 */
export const translatedError = (
    translate: TranslateService,
    error: unknown,
    operationKey: string
): Observable<string> => {
    const reasonKey = errorReasonKey(error);
    const keys = reasonKey ? [operationKey, reasonKey] : [operationKey];

    return translate.get(keys).pipe(
        take(1),
        map(texts => reasonKey
            ? `${texts[operationKey]}: ${texts[reasonKey]}`
            : texts[operationKey])
    );
};