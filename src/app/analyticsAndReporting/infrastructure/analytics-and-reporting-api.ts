import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {MissionReport} from '../domain/model/mission-report.entity';
import {MissionHistory} from '../domain/model/mission-history.entity';
import {OperationalMetric} from '../domain/model/operational-metric.entity';
import {PerformanceIndicator} from '../domain/model/performance-indicator.entity';
import {MissionReportApiEndpoint} from './mission-report-api-endpoint';
import {MissionHistoryApiEndpoint} from './mission-history-api-endpoint';
import {OperationalMetricApiEndpoint} from './operational-metric-api-endpoint';
import {PerformanceIndicatorApiEndpoint} from './performance-indicator-api-endpoint';

/**
 * Infrastructure facade for mission report, history, metric and indicator endpoint operations.
 */
@Injectable({providedIn: 'root'})
export class AnalyticsAndReportingApi extends BaseApi {
    private readonly http = inject(HttpClient);
    private readonly missionReportEndpoint = new MissionReportApiEndpoint(this.http);
    private readonly missionHistoryEndpoint = new MissionHistoryApiEndpoint(this.http);
    private readonly operationalMetricEndpoint = new OperationalMetricApiEndpoint(this.http);
    private readonly performanceIndicatorEndpoint = new PerformanceIndicatorApiEndpoint(this.http);

    /** Retrieves all mission reports. */
    getAllMissionReports = (): Observable<MissionReport[]> =>
        this.missionReportEndpoint.getAll();

    /** Retrieves a single mission report by ID. */
    getMissionReportById = (id: number): Observable<MissionReport> =>
        this.missionReportEndpoint.getById(id);

    /** Creates (generates) a mission report. */
    createMissionReport = (report: MissionReport): Observable<MissionReport> =>
        this.missionReportEndpoint.create(report);

    /** Updates an existing mission report. */
    updateMissionReport = (report: MissionReport): Observable<MissionReport> =>
        this.missionReportEndpoint.update(report, report.id);

    /** Deletes a mission report by ID. */
    deleteMissionReport = (id: number): Observable<void> =>
        this.missionReportEndpoint.delete(id);

    /** Retrieves all mission history records. */
    getAllMissionHistories = (): Observable<MissionHistory[]> =>
        this.missionHistoryEndpoint.getAll();

    /** Retrieves a single mission history record by ID. */
    getMissionHistoryById = (id: number): Observable<MissionHistory> =>
        this.missionHistoryEndpoint.getById(id);

    /** Registers a mission history record. */
    createMissionHistory = (history: MissionHistory): Observable<MissionHistory> =>
        this.missionHistoryEndpoint.create(history);

    /** Retrieves all operational metrics. */
    getAllOperationalMetrics = (): Observable<OperationalMetric[]> =>
        this.operationalMetricEndpoint.getAll();

    /** Creates an operational metric. */
    createOperationalMetric = (metric: OperationalMetric): Observable<OperationalMetric> =>
        this.operationalMetricEndpoint.create(metric);

    /** Updates an operational metric. */
    updateOperationalMetric = (metric: OperationalMetric): Observable<OperationalMetric> =>
        this.operationalMetricEndpoint.update(metric, metric.id);

    /** Deletes an operational metric by ID. */
    deleteOperationalMetric = (id: number): Observable<void> =>
        this.operationalMetricEndpoint.delete(id);

    /** Retrieves all performance indicators. */
    getAllPerformanceIndicators = (): Observable<PerformanceIndicator[]> =>
        this.performanceIndicatorEndpoint.getAll();

    /** Creates a performance indicator. */
    createPerformanceIndicator = (indicator: PerformanceIndicator): Observable<PerformanceIndicator> =>
        this.performanceIndicatorEndpoint.create(indicator);
}
