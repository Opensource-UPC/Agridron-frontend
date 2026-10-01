import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Farm} from '../domain/model/farm.entity';
import {FarmResource, FarmResponse} from './field-management-response';

export class FarmAssembler implements BaseAssembler<Farm, FarmResource, FarmResponse> {
    toEntitiesFromResponse = (response: FarmResponse): Farm[] =>
        response.farms.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: FarmResource): Farm =>
        new Farm(resource.id, resource.name, resource.location, resource.ownerId, []);

    toResourceFromEntity = (entity: Farm): FarmResource =>
        ({id: entity.id, name: entity.name, location: entity.location, ownerId: entity.ownerId});
}
