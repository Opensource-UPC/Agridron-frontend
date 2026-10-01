import {inject, Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Farm} from '../domain/model/farm.entity';
import {Parcel} from '../domain/model/parcel.entity';
import {FumigationArea} from '../domain/model/fumigationArea.entity';
import {Crop} from '../domain/model/crop.entity';
import {HttpClient} from '@angular/common/http';
import {FarmApiEndpoint} from './farm-api-endpoint';
import {ParcelApiEndpoint} from './parcel-api-endpoint';
import {FumigationAreaApiEndpoint} from './fumigation-area-api-endpoint';
import {CropApiEndpoint} from './crop-api-endpoint';
import {Observable} from 'rxjs';

/**
 * Infrastructure facade for farm, parcel, fumigation area and crop endpoint operations.
 */
@Injectable({providedIn: 'root'})
export class FieldManagementApi extends BaseApi {
    private readonly http = inject(HttpClient);
    private readonly farmEndpoint = new FarmApiEndpoint(this.http);
    private readonly parcelEndpoint = new ParcelApiEndpoint(this.http);
    private readonly fumigationAreaEndpoint = new FumigationAreaApiEndpoint(this.http);
    private readonly cropEndpoint = new CropApiEndpoint(this.http);

    /**
     * Retrieves all farms.
     * @returns Stream with the farm collection.
     */
    getAllFarms = (): Observable<Farm[]> =>
        this.farmEndpoint.getAll();

    /**
     * Retrieves a single farm by ID.
     * @param id - The ID of the farm.
     * @returns Stream with the farm.
     */
    getFarmById = (id: number): Observable<Farm> =>
        this.farmEndpoint.getById(id);

    /**
     * Creates a new farm.
     * @param farm - The farm to create.
     * @returns Stream with the created farm.
     */
    createFarm = (farm: Farm): Observable<Farm> =>
        this.farmEndpoint.create(farm);

    /**
     * Updates an existing farm.
     * @param farm - The farm to update.
     * @returns Stream with the updated farm.
     */
    updateFarm = (farm: Farm): Observable<Farm> =>
        this.farmEndpoint.update(farm, farm.id);

    /**
     * Deletes a farm by ID.
     * @param id - The ID of the farm to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteFarm = (id: number): Observable<void> =>
        this.farmEndpoint.delete(id);

    /**
     * Retrieves all parcels.
     * @returns Stream with the parcel collection.
     */
    getAllParcels = (): Observable<Parcel[]> =>
        this.parcelEndpoint.getAll();

    /**
     * Retrieves a single parcel by ID.
     * @param id - The ID of the parcel.
     * @returns Stream with the parcel.
     */
    getParcelById = (id: number): Observable<Parcel> =>
        this.parcelEndpoint.getById(id);

    /**
     * Creates a new parcel.
     * @param parcel - The parcel to create.
     * @returns Stream with the created parcel.
     */
    createParcel = (parcel: Parcel): Observable<Parcel> =>
        this.parcelEndpoint.create(parcel);

    /**
     * Updates an existing parcel.
     * @param parcel - The parcel to update.
     * @returns Stream with the updated parcel.
     */
    updateParcel = (parcel: Parcel): Observable<Parcel> =>
        this.parcelEndpoint.update(parcel, parcel.id);

    /**
     * Deletes a parcel by ID.
     * @param id - The ID of the parcel to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteParcel = (id: number): Observable<void> =>
        this.parcelEndpoint.delete(id);

    /**
     * Retrieves all fumigation areas.
     * @returns Stream with the fumigation area collection.
     */
    getAllFumigationAreas = (): Observable<FumigationArea[]> =>
        this.fumigationAreaEndpoint.getAll();

    /**
     * Retrieves a single fumigation area by ID.
     * @param id - The ID of the fumigation area.
     * @returns Stream with the fumigation area.
     */
    getFumigationAreaById = (id: number): Observable<FumigationArea> =>
        this.fumigationAreaEndpoint.getById(id);

    /**
     * Creates a new fumigation area.
     * @param fumigationArea - The fumigation area to create.
     * @returns Stream with the created fumigation area.
     */
    createFumigationArea = (fumigationArea: FumigationArea): Observable<FumigationArea> =>
        this.fumigationAreaEndpoint.create(fumigationArea);

    /**
     * Updates an existing fumigation area.
     * @param fumigationArea - The fumigation area to update.
     * @returns Stream with the updated fumigation area.
     */
    updateFumigationArea = (fumigationArea: FumigationArea): Observable<FumigationArea> =>
        this.fumigationAreaEndpoint.update(fumigationArea, fumigationArea.id);

    /**
     * Deletes a fumigation area by ID.
     * @param id - The ID of the fumigation area to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteFumigationArea = (id: number): Observable<void> =>
        this.fumigationAreaEndpoint.delete(id);

    /**
     * Retrieves all crops.
     * @returns Stream with the crop collection.
     */
    getAllCrops = (): Observable<Crop[]> =>
        this.cropEndpoint.getAll();

    /**
     * Retrieves a single crop by ID.
     * @param id - The ID of the crop.
     * @returns Stream with the crop.
     */
    getCropById = (id: number): Observable<Crop> =>
        this.cropEndpoint.getById(id);

    /**
     * Creates a new crop.
     * @param crop - The crop to create.
     * @returns Stream with the created crop.
     */
    createCrop = (crop: Crop): Observable<Crop> =>
        this.cropEndpoint.create(crop);

    /**
     * Updates an existing crop.
     * @param crop - The crop to update.
     * @returns Stream with the updated crop.
     */
    updateCrop = (crop: Crop): Observable<Crop> =>
        this.cropEndpoint.update(crop, crop.id);

    /**
     * Deletes a crop by ID.
     * @param id - The ID of the crop to delete.
     * @returns Completion stream for the delete operation.
     */
    deleteCrop = (id: number): Observable<void> =>
        this.cropEndpoint.delete(id);
}
