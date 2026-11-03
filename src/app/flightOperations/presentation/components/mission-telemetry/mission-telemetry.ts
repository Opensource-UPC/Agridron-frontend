import {Component, input, InputSignal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {Mission} from '../../../domain/model/mission.entity';
import {OperationStatus} from '../../../domain/model/operation-status.entity';
import {Drone} from '../../../../InventoryResourceManagement/domain/model/drone.entity';
import {formatDuration} from "../../mission.time";

/**
 * Displays the flight data of a mission.
 */
@Component({
    selector: 'app-mission-telemetry',
    imports: [TranslatePipe, DecimalPipe],
    templateUrl: './mission-telemetry.html',
    styleUrl: './mission-telemetry.css'
})
export class MissionTelemetry {
    /**
     * Mission whose flight parameters are shown.
     */
    mission: InputSignal<Mission> = input.required<Mission>();

    /**
     * Drone assigned to the mission.
     */
    drone: InputSignal<Drone | undefined> = input<Drone | undefined>();

    /**
     * Area of the parcel in hectares.
     */
    parcelArea: InputSignal<number | undefined> = input<number | undefined>();

    /**
     * Elapsed flight time in milliseconds.
     */
    elapsedMs: InputSignal<number> = input(0);

    /**
     * Last recorded position of the mission.
     */
    position: InputSignal<OperationStatus | undefined> = input<OperationStatus | undefined>();

    protected readonly format = formatDuration;
}