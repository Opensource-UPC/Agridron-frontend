import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a farm.
 */
export interface FarmResource extends BaseResource {
    /**
     * Unique identifier for the farm.
     */
    id: number;
    /**
     * Name of the farm.
     */
    name: string;
    /**
     * Location of the farm.
     */
    location: string;
    /**
     * Identifier of the owner of the farm.
     */
    ownerId: number;
}

/**
 * Response envelope for farm collection queries.
 */
export interface FarmResponse extends BaseResponse {
    /**
     * Array of farm resources included in the response.
     */
    farms: FarmResource[];
}

/**
 * Resource representation of a parcel.
 */
export interface ParcelResource extends BaseResource {
    /**
     * Unique identifier for the parcel.
     */
    id: number;
    /**
     * Name of the parcel.
     */
    name: string;
    /**
     * Area of the parcel.
     */
    area: number;
    /**
     * Geometry of the parcel (GeoJSON as string).
     */
    geometry: string;
    /**
     * Identifier of the farm this parcel belongs to.
     */
    farmId: number;
    /**
     * Identifier of the crop assigned to this parcel.
     */
    cropId: number;
}

/**
 * Response envelope for parcel collection queries.
 */
export interface ParcelResponse extends BaseResponse {
    /**
     * Array of parcel resources included in the response.
     */
    parcels: ParcelResource[];
}

/**
 * Resource representation of a fumigation area.
 */
export interface FumigationAreaResource extends BaseResource {
    /**
     * Unique identifier for the fumigation area.
     */
    id: number;
    /**
     * Identifier of the parcel this fumigation area belongs to.
     */
    parcelId: number;
    /**
     * Geometry of the fumigation area (GeoJSON as string).
     */
    geometry: string;
    /**
     * Area of the fumigation area.
     */
    area: number;
}

/**
 * Response envelope for fumigation area collection queries.
 */
export interface FumigationAreaResponse extends BaseResponse {
    /**
     * Array of fumigation area resources included in the response.
     */
    fumigationAreas: FumigationAreaResource[];
}

/**
 * Resource representation of a crop.
 */
export interface CropResource extends BaseResource {
    /**
     * Unique identifier for the crop.
     */
    id: number;
    /**
     * Name of the crop.
     */
    name: string;
    /**
     * Variety of the crop.
     */
    variety: string;
}

/**
 * Response envelope for crop collection queries.
 */
export interface CropResponse extends BaseResponse {
    /**
     * Array of crop resources included in the response.
     */
    crops: CropResource[];
}




