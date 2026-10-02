import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a mission report.
 */
export interface MissionReportResource extends BaseResource {
    id: number;
    missionId: number;
    type: string;
    treatedArea: number;
    appliedVolume: number;
    observations: string;
    generatedAt: string;
}

/**
 * Response envelope for mission report collection queries.
 */
export interface MissionReportResponse extends BaseResponse {
    missionReports: MissionReportResource[];
}

/**
 * Resource representation of a mission history record.
 */
export interface MissionHistoryResource extends BaseResource {
    id: number;
    missionId: number;
    finalStatus: string;
    completedAt: string;
}

/**
 * Response envelope for mission history collection queries.
 */
export interface MissionHistoryResponse extends BaseResponse {
    missionHistories: MissionHistoryResource[];
}

/**
 * Resource representation of an operational metric.
 */
export interface OperationalMetricResource extends BaseResource {
    id: number;
    reportId: number;
    name: string;
    value: number;
    unit: string;
}

/**
 * Response envelope for operational metric collection queries.
 */
export interface OperationalMetricResponse extends BaseResponse {
    operationalMetrics: OperationalMetricResource[];
}

/**
 * Resource representation of a performance indicator.
 */
export interface PerformanceIndicatorResource extends BaseResource {
    id: number;
    name: string;
    value: number;
    unit: string;
    period: string;
    calculatedAt: string;
}

/**
 * Response envelope for performance indicator collection queries.
 */
export interface PerformanceIndicatorResponse extends BaseResponse {
    performanceIndicators: PerformanceIndicatorResource[];
}
