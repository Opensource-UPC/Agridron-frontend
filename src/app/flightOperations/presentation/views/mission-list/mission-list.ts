import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {FarmStore} from '../../../../fieldManagement/application/farm.store';
import {CropStore} from '../../../../fieldManagement/application/crop.store';
import {DroneStore} from '../../../../InventoryResourceManagement/application/dron-store';
import {ConfirmDialogService} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog.service';
import {MissionStatusBadge} from '../../components/mission-status-badge/mission-status-badge';
import {Mission} from '../../../domain/model/mission.entity';
import {MissionStatus} from '../../../domain/model/mission-status.enum';

/**
 * Displays the mission collection in a modern card grid layout matching Vue styling.
 */
@Component({
    selector: 'app-mission-list',
    standalone: true,
    imports: [
        CommonModule,
        DatePipe,
        TranslatePipe,
        MatButton,
        MatIcon,
        MatProgressSpinner,
        MissionStatusBadge
    ],
    templateUrl: './mission-list.html',
    styleUrl: './mission-list.css'
})
export class MissionList {
    readonly store = inject(MissionStore);
    private readonly parcelStore = inject(ParcelStore);
    private readonly farmStore = inject(FarmStore);
    private readonly cropStore = inject(CropStore);
    private readonly droneStore = inject(DroneStore);
    private readonly confirmDialog = inject(ConfirmDialogService);
    private readonly translate = inject(TranslateService);
    protected router = inject(Router);

    /** Filter status: 'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' */
    readonly selectedFilter = signal<string>('ALL');

    /** Search query for parcel or mission id */
    readonly searchQuery = signal<string>('');

    /** Computed list of missions applying selected filter and search term */
    readonly filteredMissions = computed(() => {
        let list = this.store.missions();
        const filter = this.selectedFilter();
        const query = this.searchQuery().trim().toLowerCase();

        if (filter !== 'ALL') {
            list = list.filter(m => m.status === filter);
        }

        if (query) {
            list = list.filter(m => {
                const pName = this.parcelName(m.parcelId).toLowerCase();
                const fName = this.farmName(m.parcelId).toLowerCase();
                const cName = this.cropName(m.parcelId).toLowerCase();
                const idStr = `ms-${m.id} #${m.id}`.toLowerCase();
                return pName.includes(query) || fName.includes(query) || cName.includes(query) || idStr.includes(query);
            });
        }

        return list;
    });

    /** Status counts for filter chips */
    readonly counts = computed(() => {
        const missions = this.store.missions();
        return {
            all: missions.length,
            planned: missions.filter(m => m.status === MissionStatus.PLANNED).length,
            inProgress: missions.filter(m => m.status === MissionStatus.IN_PROGRESS).length,
            completed: missions.filter(m => m.status === MissionStatus.COMPLETED).length,
            paused: missions.filter(m => m.status === MissionStatus.PAUSED).length
        };
    });

    setFilter(filter: string): void {
        this.selectedFilter.set(filter);
    }

    onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchQuery.set(input.value);
    }

    /** Resolves parcel name */
    parcelName(parcelId: number): string {
        return this.parcelStore.parcels().find(p => p.id === parcelId)?.name ?? `Lote #${parcelId}`;
    }

    /** Resolves farm name via parcel */
    farmName(parcelId: number): string {
        const parcel = this.parcelStore.parcels().find(p => p.id === parcelId);
        if (!parcel) return '—';
        const farm = this.farmStore.farms().find(f => f.id === parcel.farmId);
        return farm?.name ?? '—';
    }

    /** Resolves crop name via parcel */
    cropName(parcelId: number): string {
        const parcel = this.parcelStore.parcels().find(p => p.id === parcelId);
        if (!parcel || !parcel.cropId) return 'Sin cultivo asignado';
        const crop = this.cropStore.crops().find(c => c.id === parcel.cropId);
        return crop?.name ?? 'Sin cultivo asignado';
    }

    /** Resolves parcel area */
    parcelArea(parcelId: number): number {
        return this.parcelStore.parcels().find(p => p.id === parcelId)?.area ?? 0;
    }

    /** Resolves drone model & serial number */
    droneInfo(droneId: number): string {
        const drone = this.droneStore.drones().find(d => d.id === droneId);
        return drone ? `${drone.model} (${drone.serialNumber})` : '—';
    }

    /** Calculates simulated or actual mission progress percentage */
    getMissionProgress(mission: Mission): number {
        switch (mission.status) {
            case MissionStatus.COMPLETED:
                return 100;
            case MissionStatus.IN_PROGRESS:
                return 65;
            case MissionStatus.PAUSED:
                return 40;
            case MissionStatus.AUTHORIZED:
                return 15;
            case MissionStatus.PLANNED:
            default:
                return 0;
        }
    }

    /** Returns CSS class for progress bar */
    progressBarClass(status: MissionStatus | null): string {
        switch (status) {
            case MissionStatus.COMPLETED:
                return 'progress-bar--completed';
            case MissionStatus.IN_PROGRESS:
                return 'progress-bar--in-progress';
            case MissionStatus.PAUSED:
                return 'progress-bar--paused';
            default:
                return 'progress-bar--planned';
        }
    }

    viewMission(id: number): void {
        this.router.navigate(['flight-operations/missions', id]).then();
    }

    editMission(id: number): void {
        this.router.navigate(['flight-operations/missions', id, 'edit']).then();
    }

    deleteMission(id: number): void {
        this.confirmDialog.confirm({
            title: this.translate.instant('mission.button.delete'),
            message: this.translate.instant('mission.deleteConfirm'),
            confirmLabel: this.translate.instant('mission.button.delete'),
            cancelLabel: this.translate.instant('mission.actions.back') || 'Cancelar'
        }).subscribe(confirmed => {
            if (confirmed) {
                this.store.deleteMission(id);
            }
        });
    }

    navigateToNew(): void {
        this.router.navigate(['flight-operations/missions/new']).then();
    }
}
