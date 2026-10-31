import {Component, computed, inject} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {MissionResultStore} from '../../../application/mission-result.store';
import {OperationStatusStore} from '../../../application/operation-status.store';
import {MissionReportStore} from '../../../../analyticsAndReporting/application/mission-report.store';
import {MissionReport} from '../../../../analyticsAndReporting/domain/model/mission-report.entity';
import {ReportType} from '../../../../analyticsAndReporting/domain/model/report-type.enum';
import {MissionPlace} from '../../components/mission-place/mission-place';
import {formatDuration} from "../../mission.time";


/**
 * Shows the summary of a completed mission and the next actions.
 */
@Component({
    selector: 'app-mission-complete',
    imports: [MatCardModule, MatButtonModule, MatIcon, TranslatePipe, DatePipe, DecimalPipe, MissionPlace],
    templateUrl: './mission-complete.html',
    styleUrl: './mission-complete.css'
})
export class MissionComplete {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly reportStore = inject(MissionReportStore);

    readonly missionId = Number(this.route.snapshot.paramMap.get('id'));
    readonly mission = inject(MissionStore).getMissionById(this.missionId);
    readonly result = inject(MissionResultStore).getByMissionId(this.missionId);
    readonly timeline = inject(OperationStatusStore).getByMissionId(this.missionId);
    readonly reports = this.reportStore.getReportsByMissionId(this.missionId);

    protected readonly format = formatDuration;

    /**
     * Summary report generated when the mission was completed.
     */
    readonly summaryReport = computed(() => this.reports().find(r => r.type === ReportType.MISSION_SUMMARY));

    /**
     * Phytosanitary report of the mission, if it was already generated.
     */
    readonly phytosanitaryReport = computed(() => this.reports().find(r => r.type === ReportType.PHYTOSANITARY));

    /**
     * Total duration between the first and the last operation status.
     */
    readonly totalMs = computed(() => {
        const entries = this.timeline();
        if (entries.length < 2) return 0;
        return (entries[entries.length - 1].timestamp?.getTime() ?? 0) - (entries[0].timestamp?.getTime() ?? 0);
    });

    /**
     * Date of the last operation status.
     */
    readonly finishedAt = computed(() => this.timeline().at(-1)?.timestamp ?? null);

    /**
     * Generates the phytosanitary report once and opens the reports view.
     */
    generateReport() {
        if (!this.phytosanitaryReport()) {
            const result = this.result();
            this.reportStore.addReport(new MissionReport(
                0,
                this.missionId,
                ReportType.PHYTOSANITARY,
                result?.treatedArea ?? 0,
                result?.appliedVolume ?? 0,
                result?.observations ?? '',
                new Date().toISOString(),
                []
            ));
        }
        this.router.navigate(['analytics']).then();
    }

    /**
     * Opens the detail of the mission summary report.
     */
    serviceReport() {
        const report = this.summaryReport();
        this.router.navigate(report ? ['analytics/reports', report.id] : ['analytics']).then();
    }

    /**
     * Opens the home view.
     */
    dashboard() {
        this.router.navigate(['home']).then();
    }
}