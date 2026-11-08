import {afterNextRender, Component, computed, effect, ElementRef, inject, input, OnDestroy, output, signal, untracked, viewChild} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import * as L from 'leaflet';
import {LatLng, polygonAreaInSquareMeters, polygonFromGeoJson, polygonToGeoJson} from '../../../domain/model/geometry';

/** Center used when there is no polygon to show: Cañete, Peru (same reference as the weather). */
const DEFAULT_CENTER: LatLng = [-13.08, -76.39];

const ESRI_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services';
const ESRI_ATTRIBUTION = 'Tiles &copy; Esri';

/**
 * Base layer chosen by the user. It lives outside the class so every map opens
 * with the last chosen view, also when another parcel is opened (FM-007, scenario 2).
 */
let selectedLayer = 'hybrid';

/**
 * Leaflet map that shows a GeoJSON polygon.
 * In editable mode each click adds a vertex, and the map emits the new GeoJSON and its area.
 */
@Component({
    selector: 'app-polygon-map',
    imports: [DecimalPipe, MatButtonModule, TranslatePipe],
    templateUrl: './polygon-map.html',
    styleUrl: './polygon-map.css'
})
export class PolygonMap implements OnDestroy {
    /** Polygon to show, as a GeoJSON string. */
    readonly geometry = input<string>('');

    /** Optional polygon drawn with a dashed line as a reference (e.g. the parcel of a fumigation area). */
    readonly reference = input<string>('');

    /** When true, each click on the map adds a vertex to the polygon. */
    readonly editable = input(false);

    /** Emits the GeoJSON of the polygon ('' while it has fewer than 3 vertices). */
    readonly geometryChange = output<string>();

    /** Emits the area of the polygon in square meters. */
    readonly areaChange = output<number>();

    /** Vertices of the polygon being shown. */
    protected readonly points = signal<LatLng[]>([]);

    /** Area of the polygon in square meters, shown under the map. */
    protected readonly squareMeters = computed(() => polygonAreaInSquareMeters(this.points()));

    private readonly container = viewChild.required<ElementRef<HTMLElement>>('map');
    private readonly translate = inject(TranslateService);

    private map?: L.Map;
    private readonly polygon = L.polygon([], {color: '#179a7a'});
    private readonly referencePolygon = L.polygon([], {color: '#1b463c', dashArray: '6', fill: false});
    private readonly vertexMarkers = L.layerGroup();

    /** Last GeoJSON emitted, to tell our own changes apart from new polygons sent by the parent. */
    private lastEmitted = '';

    constructor() {
        // Leaflet needs the <div> already in the page, so the map is created after the first render.
        afterNextRender(() => this.createMap());

        // Shows the polygon again when the parent sends a different one (edit mode, another parcel...).
        effect(() => {
            const geometry = this.geometry();
            if (this.map && geometry !== this.lastEmitted) this.showPolygon(geometry);
        });

        // Updates the reference polygon when it changes. untracked(): this effect must not re-run on every click.
        effect(() => {
            const reference = this.reference();
            if (!this.map) return;
            this.referencePolygon.setLatLngs(polygonFromGeoJson(reference));
            if (untracked(() => this.points().length) === 0) this.fitToPolygon();
        });
    }

    ngOnDestroy() {
        this.map?.remove();
    }

    /** Removes the last vertex. */
    undo() {
        this.points.update(points => points.slice(0, -1));
        this.onPolygonEdited();
    }

    /** Removes every vertex to draw the polygon again. */
    clear() {
        this.points.set([]);
        this.onPolygonEdited();
    }

    private createMap() {
        const layers = this.createBaseLayers();
        this.map = L.map(this.container().nativeElement, {layers: [layers[selectedLayer]]});

        L.control.layers({
            [this.translate.instant('map.layers.satellite')]: layers['satellite'],
            [this.translate.instant('map.layers.topographic')]: layers['topographic'],
            [this.translate.instant('map.layers.hybrid')]: layers['hybrid']
        }).addTo(this.map);

        this.map.on('baselayerchange', event => {
            selectedLayer = Object.keys(layers).find(key => layers[key] === event.layer) ?? selectedLayer;
        });

        this.referencePolygon.addTo(this.map);
        this.polygon.addTo(this.map);
        this.vertexMarkers.addTo(this.map);

        this.referencePolygon.setLatLngs(polygonFromGeoJson(this.reference()));
        this.showPolygon(this.geometry());

        if (this.editable()) {
            this.map.on('click', event => {
                this.points.update(points => [...points, [event.latlng.lat, event.latlng.lng]]);
                this.onPolygonEdited();
            });
        }
    }

    /** Satellite, topographic and hybrid (satellite + place names) views (FM-007). */
    private createBaseLayers(): Record<string, L.Layer> {
        const satellite = () => L.tileLayer(`${ESRI_URL}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, {
            attribution: ESRI_ATTRIBUTION, maxZoom: 19
        });
        return {
            satellite: satellite(),
            topographic: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap, &copy; OpenTopoMap', maxZoom: 17
            }),
            hybrid: L.layerGroup([
                satellite(),
                L.tileLayer(`${ESRI_URL}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`, {
                    attribution: ESRI_ATTRIBUTION, maxZoom: 19
                })
            ])
        };
    }

    private showPolygon(geometry: string) {
        this.points.set(polygonFromGeoJson(geometry));
        this.draw();
        this.fitToPolygon();
    }

    /** Draws the polygon and, in editable mode, a dot on each vertex. */
    private draw() {
        this.polygon.setLatLngs(this.points());
        this.vertexMarkers.clearLayers();
        if (this.editable()) {
            this.points().forEach(point =>
                L.circleMarker(point, {radius: 5, color: '#179a7a', fillOpacity: 1}).addTo(this.vertexMarkers));
        }
    }

    /** Centers the map on the polygon, on the reference polygon, or on the default center. */
    private fitToPolygon() {
        const shape = this.points().length > 0 ? this.polygon : this.referencePolygon;
        const bounds = shape.getBounds();
        if (bounds.isValid()) {
            this.map?.fitBounds(bounds, {padding: [24, 24]});
        } else {
            this.map?.setView(DEFAULT_CENTER, 13);
        }
    }

    private onPolygonEdited() {
        this.draw();
        this.lastEmitted = polygonToGeoJson(this.points());
        this.geometryChange.emit(this.lastEmitted);
        this.areaChange.emit(Math.round(this.squareMeters()));
    }
}
