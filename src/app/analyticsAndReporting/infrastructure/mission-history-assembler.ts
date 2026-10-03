import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {MissionHistory} from '../domain/model/mission-history.entity';
import {MissionHistoryResource, MissionHistoryResponse} from './analytics-and-reporting-response';

export class MissionHistoryAssembler implements BaseAssembler<MissionHistory, MissionHistoryResource, MissionHistoryResponse> {
    toEntitiesFromResponse = (response: MissionHistoryResponse): MissionHistory[] =>
        response.missionHistories.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: MissionHistoryResource): MissionHistory =>
        new MissionHistory(resource.id, resource.missionId, resource.finalStatus, resource.completedAt);

    toResourceFromEntity = (entity: MissionHistory): MissionHistoryResource => ({
        id: entity.id,
        missionId: entity.missionId,
        finalStatus: entity.finalStatus,
        completedAt: entity.completedAt
    });
}
