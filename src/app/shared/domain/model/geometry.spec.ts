import {describe, expect, it} from 'vitest';
import {LatLng, polygonAreaInSquareMeters, polygonFromGeoJson, polygonToGeoJson} from './geometry';

/** Square of about 100 m x 100 m near Cañete (0.0009° of latitude ≈ 100 m). */
const square: LatLng[] = [
    [-13.08, -76.39],
    [-13.08, -76.39 + 0.0009 / Math.cos(-13.08 * Math.PI / 180)],
    [-13.08 + 0.0009, -76.39 + 0.0009 / Math.cos(-13.08 * Math.PI / 180)],
    [-13.08 + 0.0009, -76.39]
];

describe('geometry', () => {
    it('calcula el área de un cuadrado de 100 m x 100 m (≈ 10 000 m² = 1 ha)', () => {
        expect(polygonAreaInSquareMeters(square)).toBeCloseTo(10040, -2);
    });

    it('con menos de 3 vértices no hay polígono ni área', () => {
        expect(polygonToGeoJson(square.slice(0, 2))).toBe('');
        expect(polygonAreaInSquareMeters(square.slice(0, 2))).toBe(0);
    });

    it('convierte a GeoJSON y de vuelta sin perder vértices', () => {
        expect(polygonFromGeoJson(polygonToGeoJson(square))).toEqual(square);
    });

    it('un texto vacío o inválido no tiene vértices', () => {
        expect(polygonFromGeoJson('')).toEqual([]);
        expect(polygonFromGeoJson('no es json')).toEqual([]);
    });
});
