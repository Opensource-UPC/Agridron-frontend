import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {MissionReport} from '../domain/model/mission-report.entity';
import {ReportType} from '../domain/model/report-type.enum';
import {MissionReportResource, MissionReportResponse} from './analytics-and-reporting-response';

export class MissionReportAssembler implements BaseAssembler<MissionReport, MissionReportResource, MissionReportResponse> {
    toEntitiesFromResponse = (response: MissionReportResponse): MissionReport[] =>
        response.missionReports.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: MissionReportResource): MissionReport =>
        new MissionReport(
            resource.id,
            resource.missionId,
            resource.type as ReportType,
            resource.treatedArea,
            resource.appliedVolume,
            resource.observations,
            resource.generatedAt,
            []
        );

    toResourceFromEntity = (entity: MissionReport): MissionReportResource => ({
        id: entity.id,
        missionId: entity.missionId,
        type: entity.type,
        treatedArea: entity.treatedArea,
        appliedVolume: entity.appliedVolume,
        observations: entity.observations,
        generatedAt: entity.generatedAt
    });
}
