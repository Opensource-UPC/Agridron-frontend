/**
 * A point of a polygon as [latitude, longitude], the order Leaflet uses.
 * GeoJSON stores the opposite order: [longitude, latitude].
 */
export type LatLng = [number, number];

/**
 * Reads the vertices of a GeoJSON polygon. Returns an empty list when the text is empty or invalid.
 */
export function polygonFromGeoJson(geometry: string): LatLng[] {
    try {
        const ring: number[][] = JSON.parse(geometry).coordinates[0];
        // GeoJSON repeats the first point at the end to close the ring; it is not a new vertex.
        return ring.slice(0, -1).map(([longitude, latitude]) => [latitude, longitude] as LatLng);
    } catch {
        return [];
    }
}

/**
 * Builds the GeoJSON polygon of the vertices. Returns '' while there are fewer than 3 vertices,
 * because a polygon needs at least 3 points (FM-002, scenario 2).
 */
export function polygonToGeoJson(points: LatLng[]): string {
    if (points.length < 3) return '';
    const ring = [...points, points[0]].map(([latitude, longitude]) => [longitude, latitude]);
    return JSON.stringify({type: 'Polygon', coordinates: [ring]});
}

/**
 * Area of the polygon in square meters.
 * 1. Converts each vertex from degrees to meters (1 degree ≈ 111 320 m; longitude degrees shrink with cos(latitude)).
 * 2. Applies the shoelace formula: half of the absolute sum of the cross products of consecutive vertices.
 * The flat approximation is accurate for parcel-sized areas.
 */
export function polygonAreaInSquareMeters(points: LatLng[]): number {
    if (points.length < 3) return 0;

    const metersPerDegree = 111320;
    const averageLatitude = points.reduce((sum, [latitude]) => sum + latitude, 0) / points.length;
    const longitudeScale = Math.cos(averageLatitude * Math.PI / 180);
    const meters = points.map(([latitude, longitude]) => [
        longitude * metersPerDegree * longitudeScale,
        latitude * metersPerDegree
    ]);

    let sum = 0;
    for (let i = 0; i < meters.length; i++) {
        const [x1, y1] = meters[i];
        const [x2, y2] = meters[(i + 1) % meters.length];
        sum += x1 * y2 - x2 * y1;
    }
    return Math.abs(sum) / 2;
}
