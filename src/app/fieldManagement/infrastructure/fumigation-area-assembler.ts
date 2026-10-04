import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {FumigationArea} from '../domain/model/fumigationArea.entity';
import {FumigationAreaResource, FumigationAreaResponse} from './field-management-response';

export class FumigationAreaAssembler implements BaseAssembler<FumigationArea, FumigationAreaResource, FumigationAreaResponse> {
    toEntitiesFromResponse = (response: FumigationAreaResponse): FumigationArea[] =>
        response.fumigationAreas.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: FumigationAreaResource): FumigationArea =>
        new FumigationArea(resource.id, resource.parcelId, resource.geometry, resource.area);

    toResourceFromEntity = (entity: FumigationArea): FumigationAreaResource =>
        ({id: entity.id, parcelId: entity.parcelId, geometry: entity.geometry, area: entity.area});
}
