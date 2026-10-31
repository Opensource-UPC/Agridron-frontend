import {Component, computed, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStatus} from '../../../domain/model/mission-status.enum';

/**
 * Displays a colored badge for a mission status.
 */
@Component({
    selector: 'app-mission-status-badge',
    imports: [TranslatePipe],
    templateUrl: './mission-status-badge.html',
    styleUrl: './mission-status-badge.css'
})
export class MissionStatusBadge {
    /**
     * Status to display.
     */
    status: InputSignal<MissionStatus | null> = input.required<MissionStatus | null>();

    /**
     * CSS classes derived from the status.
     */
    protected readonly cssClass = computed(() => `badge badge--${(this.status() ?? '').toLowerCase()}`);
}