import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Parcel} from '../domain/model/parcel.entity';
import {ParcelResource, ParcelResponse} from './field-management-response';

export class ParcelAssembler implements BaseAssembler<Parcel, ParcelResource, ParcelResponse> {
    toEntitiesFromResponse = (response: ParcelResponse): Parcel[] =>
        response.parcels.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: ParcelResource): Parcel =>
        new Parcel(resource.id, resource.name, resource.area, resource.geometry, resource.farmId, resource.cropId, resource.image ?? null);

    toResourceFromEntity = (entity: Parcel): ParcelResource =>
        ({id: entity.id, name: entity.name, area: entity.area, geometry: entity.geometry, farmId: entity.farmId, cropId: entity.cropId, image: entity.image ?? undefined});
}
