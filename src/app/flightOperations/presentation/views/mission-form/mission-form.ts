import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {Mission} from '../../../domain/model/mission.entity';
import {MissionStatus} from '../../../domain/model/mission-status.enum';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {DroneStore} from '../../../../InventoryResourceManagement/application/dron-store';
import {AuthenticationService} from '../../../../iam/application/authentication.service';
import {AgrochemicalStore} from "../../../application/agrochemical.store";

/**
 * Formats a date as the value expected by a datetime-local input.
 * @param date - The date to format.
 */
const toLocalInput = (date: Date | null): string =>
    date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';

/**
 * Creates and edits mission entities.
 */
@Component({
    selector: 'app-mission-form',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatInput,
        TranslatePipe
    ],
    templateUrl: './mission-form.html',
    styleUrl: './mission-form.css'
})
export class MissionForm {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store = inject(MissionStore);
    private auth = inject(AuthenticationService);

    /**
     * Form-group for the mission form.
     */
    form = this.fb.group({
        requestedDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
        parcelId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        agrochemicalId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        droneId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        flightHeight: new FormControl<number | null>(null, { validators: [Validators.min(1)] }),
        flightSpeed: new FormControl<number | null>(null, { validators: [Validators.min(1)] }),
        sprayRate: new FormControl<number | null>(null, { validators: [Validators.min(0.1)] }),
        overlap: new FormControl<number | null>(null, { validators: [Validators.min(0), Validators.max(100)] })
    });

    /**
     * Signals for the lists used by the selects.
     */
    parcels = inject(ParcelStore).parcels;
    drones = inject(DroneStore).drones;
    agrochemicals = inject(AgrochemicalStore).agrochemicals;

    /**
     * Indicates if the form is in edit mode.
     */
    isEdit = false;

    /**
     * The ID of the mission being edited, or null for new missions.
     */
    missionId: number | null = null;

    /**
     * Creates an instance of MissionForm and initializes the form based on route parameters.
     */
    constructor() {
        this.route.params.subscribe(params => {
            this.missionId = params['id'] ? +params['id'] : null;
            this.isEdit = !!this.missionId;
            if (this.isEdit && this.missionId) {
                const id = this.missionId;
                const mission = this.store.getMissionById(id)();
                if (mission) {
                    this.form.patchValue({
                        requestedDate: toLocalInput(mission.requestedDate),
                        parcelId: mission.parcelId,
                        agrochemicalId: mission.agrochemicalId,
                        droneId: mission.droneId,
                        flightHeight: mission.flightHeight,
                        flightSpeed: mission.flightSpeed,
                        sprayRate: mission.sprayRate,
                        overlap: mission.overlap
                    });
                }
            }
        });
    }

    /**
     * Submits the form to create or update the mission.
     */
    submit() {
        if (this.form.invalid) return;
        const value = this.form.getRawValue();
        const existing = this.missionId ? this.store.getMissionById(this.missionId)() : undefined;
        const mission = new Mission(
            this.missionId ?? 0,
            new Date(value.requestedDate),
            value.parcelId!,
            value.agrochemicalId!,
            value.droneId!,
            existing?.operatorId ?? this.auth.currentUser()?.id ?? 1,
            value.flightHeight,
            value.flightSpeed,
            value.sprayRate,
            value.overlap,
            existing?.status ?? MissionStatus.PLANNED
        );

        if (this.isEdit) {
            this.store.updateMission(mission);
        } else {
            this.store.addMission(mission);
        }

        this.router.navigate(['flight-operations/missions']).then();
    }
}