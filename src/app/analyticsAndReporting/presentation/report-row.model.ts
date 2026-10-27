import {MissionReport} from '../domain/model/mission-report.entity';
import {ReportType} from '../domain/model/report-type.enum';

/**
 * Mission report enriched with the names of its parcel and farm (resolved from field management data).
 */
export interface ReportRow {
  report: MissionReport;
  parcelName: string;
  farmId: number | null;
  farmName: string;
}

/**
 * Keeps one row per mission, preferring the mission summary report.
 * A mission can have several reports (summary and phytosanitary) that repeat the same area and volume,
 * so aggregations must count each mission only once.
 * @param rows - Report rows to reduce.
 */
export function uniqueByMission(rows: ReportRow[]): ReportRow[] {
  const byMission = new Map<number, ReportRow>();
  for (const row of rows) {
    const current = byMission.get(row.report.missionId);
    const isBetter = !current
      || (current.report.type !== ReportType.MISSION_SUMMARY && row.report.type === ReportType.MISSION_SUMMARY);
    if (isBetter) {
      byMission.set(row.report.missionId, row);
    }
  }
  return [...byMission.values()];
}
