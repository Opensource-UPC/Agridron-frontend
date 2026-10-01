import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Crop} from '../domain/model/crop.entity';
import {CropResource, CropResponse} from './field-management-response';

export class CropAssembler implements BaseAssembler<Crop, CropResource, CropResponse> {
    toEntitiesFromResponse = (response: CropResponse): Crop[] =>
        response.crops.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: CropResource): Crop =>
        new Crop(resource.id, resource.name, resource.variety);

    toResourceFromEntity = (entity: Crop): CropResource =>
        ({id: entity.id, name: entity.name ?? '', variety: entity.variety ?? ''});
}
