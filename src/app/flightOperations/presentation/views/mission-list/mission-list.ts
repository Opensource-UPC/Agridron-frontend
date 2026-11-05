import {Component, computed, inject, viewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {MatError} from '@angular/material/form-field';
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from '@angular/material/table';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatIcon} from '@angular/material/icon';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {MissionStatusBadge} from '../../components/mission-status-badge/mission-status-badge';

/**
 * Displays the mission collection with table actions.
 */
@Component({
    selector: 'app-mission-list',
    imports: [
        MatError,
        MatTable,
        MatHeaderCellDef,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderRowDef,
        MatRowDef,
        MatButton,
        MatHeaderRow,
        MatRow,
        MatProgressSpinner,
        TranslatePipe,
        MatIcon,
        MatIconButton,
        MatSort,
        MatSortHeader,
        MatPaginator,
        DatePipe,
        MissionStatusBadge
    ],
    templateUrl: './mission-list.html',
    styleUrl: './mission-list.css'
})
export class MissionList {
    readonly store = inject(MissionStore);
    private readonly parcelStore = inject(ParcelStore);
    protected router = inject(Router);

    /**
     * Columns to display in the table.
     */
    displayedColumns: string[] = ['id', 'parcel', 'requestedDate', 'status', 'actions'];

    readonly sort = viewChild(MatSort);
    readonly paginator = viewChild(MatPaginator);

    /**
     * Computed data source for the table.
     */
    readonly dataSource = computed(() => {
        const source = new MatTableDataSource(this.store.missions());
        const sort = this.sort();
        if (sort) {
            source.sort = sort;
        }
        const paginator = this.paginator();
        if (paginator) {
            source.paginator = paginator;
        }
        return source;
    });

    /**
     * Resolves the name of a parcel.
     * @param parcelId - The ID of the parcel.
     * @returns The parcel name, or a fallback with its identifier.
     */
    parcelName(parcelId: number): string {
        return this.parcelStore.parcels().find(p => p.id === parcelId)?.name ?? `#${parcelId}`;
    }

    /**
     * Navigates to the detail view of a mission.
     * @param id - The ID of the mission to view.
     */
    viewMission(id: number) {
        this.router.navigate(['flight-operations/missions', id]).then();
    }

    /**
     * Navigates to the edit page for a mission.
     * @param id - The ID of the mission to edit.
     */
    editMission(id: number) {
        this.router.navigate(['flight-operations/missions', id, 'edit']).then();
    }

    /**
     * Deletes a mission by ID.
     * @param id - The ID of the mission to delete.
     */
    deleteMission(id: number) {
        this.store.deleteMission(id);
    }

    /**
     * Navigates to the new mission form.
     */
    navigateToNew() {
        this.router.navigate(['flight-operations/missions/new']).then();
    }
}