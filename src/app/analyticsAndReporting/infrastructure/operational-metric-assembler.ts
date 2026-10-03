import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {OperationalMetric} from '../domain/model/operational-metric.entity';
import {OperationalMetricResource, OperationalMetricResponse} from './analytics-and-reporting-response';

export class OperationalMetricAssembler implements BaseAssembler<OperationalMetric, OperationalMetricResource, OperationalMetricResponse> {
    toEntitiesFromResponse = (response: OperationalMetricResponse): OperationalMetric[] =>
        response.operationalMetrics.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: OperationalMetricResource): OperationalMetric =>
        new OperationalMetric(resource.id, resource.reportId, resource.name, resource.value, resource.unit);

    toResourceFromEntity = (entity: OperationalMetric): OperationalMetricResource => ({
        id: entity.id,
        reportId: entity.reportId,
        name: entity.name,
        value: entity.value,
        unit: entity.unit
    });
}
