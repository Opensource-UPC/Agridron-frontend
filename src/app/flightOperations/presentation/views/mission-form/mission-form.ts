import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {CropStore} from '../../../../fieldManagement/application/crop.store';
import {DroneStore} from '../../../../InventoryResourceManagement/application/dron-store';
import {AgrochemicalStore} from '../../../application/agrochemical.store';
import {AuthenticationService} from '../../../../iam/application/authentication.service';
import {Mission} from '../../../domain/model/mission.entity';
import {MissionStatus} from '../../../domain/model/mission-status.enum';

/**
 * Multi-step wizard form matching the Vue design for creating and editing missions.
 */
@Component({
    selector: 'app-mission-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslatePipe,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './mission-form.html',
    styleUrl: './mission-form.css'
})
export class MissionForm implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly store = inject(MissionStore);
    private readonly auth = inject(AuthenticationService);
    private readonly farmStore = inject(FarmStore);
    private readonly parcelStore = inject(ParcelStore);
    private readonly cropStore = inject(CropStore);
    private readonly droneStore = inject(DroneStore);
    private readonly agrochemicalStore = inject(AgrochemicalStore);
    private readonly translate = inject(TranslateService);

    /** Stores data */
    readonly farms = this.farmStore.farms;
    readonly parcels = this.parcelStore.parcels;
    readonly crops = this.cropStore.crops;
    readonly drones = this.droneStore.drones;
    readonly agrochemicals = this.agrochemicalStore.agrochemicals;

    /** Active wizard step: 1 | 2 | 3 | 4 */
    readonly activeStep = signal<number>(1);

    /** Zoom level simulation for map frame */
    readonly zoomLevel = signal<number>(1);

    /** Indicates edit mode */
    isEdit = false;
    missionId: number | null = null;

    /** Loading / saving state */
    readonly saving = signal<boolean>(false);
    readonly feedbackMessage = signal<string>('');

    /** Wizard steps metadata */
    readonly steps = [
        { num: 1, labelKey: 'mission.wizard.step1' },
        { num: 2, labelKey: 'mission.wizard.step2' },
        { num: 3, labelKey: 'mission.wizard.step3' },
        { num: 4, labelKey: 'mission.wizard.step4' }
    ];

    /** Reactive Form structure */
    form = this.fb.group({
        farmId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        parcelId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        date: new FormControl<string>(new Date().toISOString().slice(0, 10), { nonNullable: true, validators: [Validators.required] }),
        time: new FormControl<string>('08:00', { nonNullable: true, validators: [Validators.required] }),
        droneId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        agrochemicalId: new FormControl<number | null>(null, { validators: [Validators.required] }),
        sprayRate: new FormControl<number | null>(2.0, { validators: [Validators.required, Validators.min(0.1)] }),
        flightHeight: new FormControl<number | null>(3, { validators: [Validators.min(1)] }),
        flightSpeed: new FormControl<number | null>(5, { validators: [Validators.min(1)] }),
        overlap: new FormControl<number | null>(20, { validators: [Validators.min(0), Validators.max(100)] }),
        notes: new FormControl<string>('')
    });

    /** Parcels filtered by selected farm */
    readonly filteredParcels = computed(() => {
        const farmId = this.form.get('farmId')?.value;
        if (!farmId) return this.parcels();
        return this.parcels().filter(p => Number(p.farmId) === Number(farmId));
    });

    /** Selected farm model */
    readonly selectedFarm = computed(() => {
        const farmId = this.form.get('farmId')?.value;
        if (!farmId) return null;
        return this.farms().find(f => Number(f.id) === Number(farmId)) ?? null;
    });

    /** Selected parcel model */
    readonly selectedParcel = computed(() => {
        const parcelId = this.form.get('parcelId')?.value;
        if (!parcelId) return null;
        return this.parcels().find(p => Number(p.id) === Number(parcelId)) ?? null;
    });

    /** Selected crop name */
    readonly selectedCrop = computed(() => {
        const parcel = this.selectedParcel();
        if (!parcel || !parcel.cropId) return 'Sin cultivo asignado';
        const crop = this.crops().find(c => Number(c.id) === Number(parcel.cropId));
        return crop?.name ?? 'Sin cultivo asignado';
    });

    /** Selected drone model */
    readonly selectedDrone = computed(() => {
        const droneId = this.form.get('droneId')?.value;
        if (!droneId) return null;
        return this.drones().find(d => Number(d.id) === Number(droneId)) ?? null;
    });

    /** Selected agrochemical model */
    readonly selectedAgrochemical = computed(() => {
        const agroId = this.form.get('agrochemicalId')?.value;
        if (!agroId) return null;
        return this.agrochemicals().find(a => Number(a.id) === Number(agroId)) ?? null;
    });

    /** Image for preview */
    readonly currentImage = computed(() => {
        const parcel = this.selectedParcel();
        if (parcel?.image) return parcel.image;
        const farm = this.selectedFarm();
        if (farm?.image) return farm.image;
        return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200';
    });

    /** Formatted date & time string for summary */
    readonly summaryDateTime = computed(() => {
        const date = this.form.get('date')?.value;
        const time = this.form.get('time')?.value;
        if (!date || !time) return 'No programada';
        return `${date} · ${time}`;
    });

    /** Validation check for step transition */
    readonly canMoveForward = computed(() => {
        const step = this.activeStep();
        const f = this.form;
        if (step === 1) return Boolean(f.get('farmId')?.value && f.get('parcelId')?.value);
        if (step === 2) return Boolean(f.get('date')?.value && f.get('time')?.value && f.get('droneId')?.value);
        if (step === 3) return Boolean(f.get('agrochemicalId')?.value && f.get('sprayRate')?.valid);
        return true;
    });

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.missionId = params['id'] ? +params['id'] : null;
            this.isEdit = !!this.missionId;

            if (this.isEdit && this.missionId) {
                const mission = this.store.getMissionById(this.missionId)();
                if (mission) {
                    this.populateFromMission(mission);
                } else {
                    // Retry once missions load if not yet populated
                    setTimeout(() => {
                        const m = this.store.getMissionById(this.missionId!)();
                        if (m) this.populateFromMission(m);
                    }, 500);
                }
            } else {
                this.initializeNewDefaults();
            }
        });
    }

    private populateFromMission(mission: Mission): void {
        const parcel = this.parcels().find(p => p.id === mission.parcelId);
        const reqDate = mission.requestedDate ? new Date(mission.requestedDate) : new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const dateStr = `${reqDate.getFullYear()}-${pad(reqDate.getMonth() + 1)}-${pad(reqDate.getDate())}`;
        const timeStr = `${pad(reqDate.getHours())}:${pad(reqDate.getMinutes())}`;

        this.form.patchValue({
            farmId: parcel?.farmId ?? null,
            parcelId: mission.parcelId,
            date: dateStr,
            time: timeStr,
            droneId: mission.droneId,
            agrochemicalId: mission.agrochemicalId,
            flightHeight: mission.flightHeight ?? 3,
            flightSpeed: mission.flightSpeed ?? 5,
            sprayRate: mission.sprayRate ?? 2.0,
            overlap: mission.overlap ?? 20
        });
    }

    private initializeNewDefaults(): void {
        // Auto-select first farm and parcel if available
        if (this.farms().length > 0 && !this.form.get('farmId')?.value) {
            const firstFarm = this.farms()[0];
            this.form.get('farmId')?.setValue(firstFarm.id);

            const parcelsOfFarm = this.parcels().filter(p => Number(p.farmId) === Number(firstFarm.id));
            if (parcelsOfFarm.length > 0) {
                this.form.get('parcelId')?.setValue(parcelsOfFarm[0].id);
            }
        }

        // Auto-select first drone if available
        if (this.drones().length > 0 && !this.form.get('droneId')?.value) {
            this.form.get('droneId')?.setValue(this.drones()[0].id);
        }

        // Auto-select first agrochemical if available
        if (this.agrochemicals().length > 0 && !this.form.get('agrochemicalId')?.value) {
            this.form.get('agrochemicalId')?.setValue(this.agrochemicals()[0].id);
        }
    }

    onFarmChange(): void {
        const farmId = this.form.get('farmId')?.value;
        const matchingParcels = this.parcels().filter(p => Number(p.farmId) === Number(farmId));
        if (matchingParcels.length > 0) {
            this.form.get('parcelId')?.setValue(matchingParcels[0].id);
        } else {
            this.form.get('parcelId')?.setValue(null);
        }
    }

    zoomIn(): void {
        this.zoomLevel.update(z => Math.min(z + 0.25, 2.0));
    }

    zoomOut(): void {
        this.zoomLevel.update(z => Math.max(z - 0.25, 0.75));
    }

    resetZoom(): void {
        this.zoomLevel.set(1);
    }

    setStep(stepNum: number): void {
        if (stepNum < this.activeStep() || this.canMoveForward()) {
            this.activeStep.set(stepNum);
        }
    }

    nextStep(): void {
        if (!this.canMoveForward()) return;
        if (this.activeStep() < 4) {
            this.activeStep.update(s => s + 1);
        }
    }

    prevStep(): void {
        if (this.activeStep() > 1) {
            this.activeStep.update(s => s - 1);
        }
    }

    cancel(): void {
        this.router.navigate(['flight-operations/missions']).then();
    }

    submit(): void {
        if (this.form.invalid) {
            this.feedbackMessage.set('Por favor completa todos los campos requeridos.');
            return;
        }

        this.saving.set(true);
        this.feedbackMessage.set('');

        const val = this.form.value;
        const dateTimeStr = `${val.date}T${val.time || '08:00'}:00`;
        const requestedDate = new Date(dateTimeStr);

        const mission = new Mission(
            this.missionId ?? 0,
            requestedDate,
            Number(val.parcelId),
            Number(val.agrochemicalId),
            Number(val.droneId),
            this.auth.currentUser()?.id ?? 1,
            val.flightHeight ? Number(val.flightHeight) : 3,
            val.flightSpeed ? Number(val.flightSpeed) : 5,
            val.sprayRate ? Number(val.sprayRate) : 2.0,
            val.overlap ? Number(val.overlap) : 20,
            MissionStatus.PLANNED
        );

        try {
            if (this.isEdit) {
                this.store.updateMission(mission);
            } else {
                this.store.addMission(mission);
            }
            this.router.navigate(['flight-operations/missions']).then();
        } catch (error: any) {
            this.feedbackMessage.set(error?.message || 'Error al guardar la misión.');
            this.saving.set(false);
        }
    }
}
