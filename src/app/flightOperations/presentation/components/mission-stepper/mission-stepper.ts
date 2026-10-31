import {Component, input, InputSignal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Displays the progress of a mission through its lifecycle steps.
 */
@Component({
    selector: 'app-mission-stepper',
    imports: [TranslatePipe],
    templateUrl: './mission-stepper.html',
    styleUrl: './mission-stepper.css'
})
export class MissionStepper {
    /**
     * Index of the current step (0 based).
     */
    currentStep: InputSignal<number> = input.required<number>();

    /**
     * Translation keys of the lifecycle steps.
     */
    protected readonly steps = ['preparation', 'takeoff', 'flying', 'finish'];
}