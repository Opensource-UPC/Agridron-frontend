import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {PerformanceIndicator} from '../domain/model/performance-indicator.entity';
import {PerformanceIndicatorResource, PerformanceIndicatorResponse} from './analytics-and-reporting-response';

export class PerformanceIndicatorAssembler implements BaseAssembler<PerformanceIndicator, PerformanceIndicatorResource, PerformanceIndicatorResponse> {
    toEntitiesFromResponse = (response: PerformanceIndicatorResponse): PerformanceIndicator[] =>
        response.performanceIndicators.map(resource => this.toEntityFromResource(resource));

    toEntityFromResource = (resource: PerformanceIndicatorResource): PerformanceIndicator =>
        new PerformanceIndicator(resource.id, resource.name, resource.value, resource.unit, resource.period, resource.calculatedAt);

    toResourceFromEntity = (entity: PerformanceIndicator): PerformanceIndicatorResource => ({
        id: entity.id,
        name: entity.name,
        value: entity.value,
        unit: entity.unit,
        period: entity.period,
        calculatedAt: entity.calculatedAt
    });
}
