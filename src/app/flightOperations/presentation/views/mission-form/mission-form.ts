import {Component, computed, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';
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
import {AgrochemicalStore} from '../../../../InventoryResourceManagement/application/agrochemical-store';
import {AuthenticationService} from '../../../../iam/application/authentication.service';

/**
 * Formats a date as the value expected by a datetime-local input.
 * @param date - The date to format.
 */
const toLocalInput = (date: Date | null): string =>
    date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';

/**
 * Today as YYYY-MM-DD in local time.
 */
const todayString = (): string => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
};

/**
 * The mission date cannot be in the past (1 minute of tolerance).
 */
const notPast = (control: AbstractControl): ValidationErrors | null =>
    control.value && new Date(control.value).getTime() < Date.now() - 60000 ? {pastDate: true} : null;

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
    private destroyRef = inject(DestroyRef);
    private store = inject(MissionStore);
    private auth = inject(AuthenticationService);
    private droneStore = inject(DroneStore);
    private agrochemicalStore = inject(AgrochemicalStore);

    /**
     * Parcels available in the select.
     */
    parcels = inject(ParcelStore).parcels;

    private readonly today = todayString();

    /**
     * Form-group for the mission form.
     * It must be declared after the stores, because the group validator reads them.
     */
    form = this.fb.group({
        requestedDate: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, notPast]}),
        parcelId: new FormControl<number | null>(null, {validators: [Validators.required]}),
        agrochemicalId: new FormControl<number | null>(null, {validators: [Validators.required]}),
        droneId: new FormControl<number | null>(null, {validators: [Validators.required]}),
        flightHeight: new FormControl<number | null>(null, {validators: [Validators.min(1)]}),
        flightSpeed: new FormControl<number | null>(null, {validators: [Validators.min(1)]}),
        sprayRate: new FormControl<number | null>(null, {validators: [Validators.min(0.1)]}),
        overlap: new FormControl<number | null>(null, {validators: [Validators.min(0), Validators.max(100)]})
    }, {
        // Parcel area x spray rate cannot exceed the stock of the chosen agrochemical.
        validators: (group: AbstractControl): ValidationErrors | null => {
            const parcel = this.parcels().find(p => p.id === group.get('parcelId')?.value);
            const chemical = this.agrochemicalStore.agrochemicals()
                .find(a => a.id === group.get('agrochemicalId')?.value);
            const rate = group.get('sprayRate')?.value;
            if (!parcel || !chemical || !rate) return null;
            return parcel.area * rate > chemical.stockLiters ? {insufficientStock: true} : null;
        }
    });

    private readonly selectedDroneId = toSignal(this.form.controls.droneId.valueChanges,
        {initialValue: this.form.controls.droneId.value});

    private readonly selectedAgrochemicalId = toSignal(this.form.controls.agrochemicalId.valueChanges,
        {initialValue: this.form.controls.agrochemicalId.value});

    /**
     * Only available drones (the one already assigned is kept when editing).
     */
    drones = computed(() => {
        const current = this.selectedDroneId();
        return this.droneStore.drones().filter(d => d.status === 'available' || d.id === current);
    });

    /**
     * Only non-expired agrochemicals with stock (the one already assigned is kept when editing).
     */
    agrochemicals = computed(() => {
        const current = this.selectedAgrochemicalId();
        return this.agrochemicalStore.agrochemicals()
            .filter(a => a.id === current || (!a.isExpired(this.today) && a.stockLiters > 0));
    });

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
                // An existing mission may have a past date.
                this.form.controls.requestedDate.removeValidators(notPast);
                this.form.controls.requestedDate.updateValueAndValidity();
                const mission = this.store.getMissionById(this.missionId)();
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

        // When creating, the spray rate defaults to the recommended dose of the product.
        this.form.controls.agrochemicalId.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(id => {
                const chemical = this.agrochemicalStore.agrochemicals().find(a => a.id === id);
                if (chemical && !this.isEdit && !this.form.controls.sprayRate.value) {
                    this.form.controls.sprayRate.setValue(chemical.recommendedDoseLitersPerHa);
                }
            });
    }

    /**
     * Submits the form to create or update the mission.
     */
    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
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