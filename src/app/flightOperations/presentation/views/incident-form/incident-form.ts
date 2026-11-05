import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {IncidentStore} from '../../../application/incident.store';
import {Incident} from '../../../domain/model/incident.entity';
import {MissionPlace} from '../../components/mission-place/mission-place';

/**
 * Registers an incident for a mission.
 */
@Component({
    selector: 'app-incident-form',
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatInput,
        TranslatePipe,
        MissionPlace
    ],
    templateUrl: './incident-form.html',
    styleUrl: './incident-form.css'
})
export class IncidentForm {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private store = inject(IncidentStore);

    /**
     * The ID of the mission the incident belongs to.
     */
    missionId = Number(this.route.snapshot.paramMap.get('id'));

    mission = inject(MissionStore).getMissionById(this.missionId);

    /**
     * Incident types available in the select.
     */
    types = ['TECHNICAL', 'WEATHER', 'SAFETY', 'OTHER'];

    /**
     * Form-group for the incident form.
     */
    form = this.fb.group({
        type: new FormControl<string | null>(null, { validators: [Validators.required] }),
        description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
    });

    /**
     * Submits the form to register the incident.
     */
    submit() {
        if (this.form.invalid) return;
        const value = this.form.getRawValue();
        this.store.addIncident(new Incident(0, this.missionId, value.type, value.description, new Date()));
        this.cancel();
    }

    /**
     * Goes back to the mission detail.
     */
    cancel() {
        this.router.navigate(['flight-operations/missions', this.missionId]).then();
    }
}