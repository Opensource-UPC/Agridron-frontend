import {inject, Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MissionReport} from '../domain/model/mission-report.entity';

/**
 * Generates the PDF version of a mission report in the browser.
 */
@Injectable({providedIn: 'root'})
export class ReportPdfService {
  private readonly translate = inject(TranslateService);

  /**
   * Builds and downloads the PDF of a report.
   * @param report - The report to export.
   * @param parcelName - Display name of the parcel.
   * @param farmName - Display name of the farm.
   */
  async download(report: MissionReport, parcelName: string, farmName: string): Promise<void> {
    const {jsPDF} = await import('jspdf');
    const t = (key: string): string => this.translate.instant(key);
    const doc = new jsPDF();
    const left = 14;
    let y = 20;

    const line = (label: string, value: string): void => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, left, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, left + 52, y);
      y += 8;
    };

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(t('analytics.pdf.title'), left, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${t('analytics.detail.title')} #${report.id} - ${t('analytics.reportType.' + report.type)}`, left, y);
    y += 12;

    const density = report.treatedArea > 0 ? (report.appliedVolume / report.treatedArea).toFixed(1) : '-';
    line(t('analytics.columns.mission'), `MS-${String(report.missionId).padStart(3, '0')}`);
    line(t('analytics.columns.farm'), farmName);
    line(t('analytics.columns.parcel'), parcelName);
    line(t('analytics.columns.generatedAt'), report.generatedAt.slice(0, 16).replace('T', ' '));
    line(t('analytics.columns.area'), report.treatedArea.toFixed(1));
    line(t('analytics.columns.volume'), report.appliedVolume.toFixed(1));
    line(t('analytics.columns.density'), density);

    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.text(`${t('analytics.detail.observations')}:`, left, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    const observations: string[] = doc.splitTextToSize(report.observations || '-', 180);
    doc.text(observations, left, y);
    y += observations.length * 6 + 6;

    doc.setFont('helvetica', 'bold');
    doc.text(`${t('analytics.detail.metrics')}:`, left, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    if (report.metrics.length === 0) {
      doc.text(t('analytics.detail.noMetrics'), left, y);
    } else {
      for (const metric of report.metrics) {
        doc.text(`- ${metric.toDisplay()}`, left, y);
        y += 6;
      }
    }

    doc.save(`mission-report-${report.id}.pdf`);
  }
}
