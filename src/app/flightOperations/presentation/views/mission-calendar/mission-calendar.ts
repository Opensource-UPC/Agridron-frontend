import {Component, computed, inject, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {MissionStore} from '../../../application/mission.store';
import {ParcelStore} from '../../../../fieldManagement/application/parcel.store';
import {Mission} from '../../../domain/model/mission.entity';
import {MissionStatusBadge} from '../../components/mission-status-badge/mission-status-badge';

/** Period shown by the calendar (MI-005). */
type CalendarPeriod = 'week' | 'month';

/** Missions of one day of the calendar. */
interface CalendarDay {
    date: Date;
    missions: Mission[];
}

/**
 * Calendar of the scheduled missions (MI-005): shows the missions of a week or a month,
 * grouped by day and with their status.
 */
@Component({
    selector: 'app-mission-calendar',
    imports: [DatePipe, MatButtonModule, MatIcon, TranslatePipe, MissionStatusBadge],
    templateUrl: './mission-calendar.html',
    styleUrl: './mission-calendar.css'
})
export class MissionCalendar {
    readonly store = inject(MissionStore);
    private readonly parcelStore = inject(ParcelStore);
    private readonly router = inject(Router);

    /** Week or month, chosen by the user. */
    readonly period = signal<CalendarPeriod>('week');

    /** Any day inside the period being shown; it starts on today. */
    readonly referenceDate = signal(new Date());

    /** First and last day of the period. Weeks start on Monday. */
    readonly range = computed(() => {
        const date = this.referenceDate();
        const year = date.getFullYear();
        const month = date.getMonth();

        if (this.period() === 'month') {
            // Day 0 of the next month is the last day of this month.
            return {start: new Date(year, month, 1), end: new Date(year, month + 1, 0)};
        }

        // getDay() is 0 on Sunday; this gives how many days have passed since Monday.
        const daysSinceMonday = (date.getDay() + 6) % 7;
        const monday = date.getDate() - daysSinceMonday;
        return {start: new Date(year, month, monday), end: new Date(year, month, monday + 6)};
    });

    /** Missions of the period, sorted by date and grouped by day. */
    readonly days = computed<CalendarDay[]>(() => {
        const {start, end} = this.range();
        const afterEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1);

        const missions = this.store.missions()
            .filter(mission => {
                const date = mission.requestedDate ? new Date(mission.requestedDate) : null;
                return date !== null && date >= start && date < afterEnd;
            })
            .sort((a, b) => new Date(a.requestedDate!).getTime() - new Date(b.requestedDate!).getTime());

        const days: CalendarDay[] = [];
        for (const mission of missions) {
            const date = new Date(mission.requestedDate!);
            const lastDay = days.at(-1);
            if (lastDay && lastDay.date.toDateString() === date.toDateString()) {
                lastDay.missions.push(mission);
            } else {
                days.push({date, missions: [mission]});
            }
        }
        return days;
    });

    setPeriod(period: CalendarPeriod): void {
        this.period.set(period);
    }

    /** Moves one week or one month back (-1) or forward (+1). */
    move(step: number): void {
        const date = this.referenceDate();
        if (this.period() === 'month') {
            this.referenceDate.set(new Date(date.getFullYear(), date.getMonth() + step, 1));
        } else {
            this.referenceDate.set(new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 * step));
        }
    }

    goToToday(): void {
        this.referenceDate.set(new Date());
    }

    parcelName(parcelId: number): string {
        return this.parcelStore.parcels().find(parcel => parcel.id === parcelId)?.name ?? `#${parcelId}`;
    }

    viewMission(id: number): void {
        this.router.navigate(['flight-operations/missions', id]).then();
    }

    back(): void {
        this.router.navigate(['flight-operations/missions']).then();
    }
}
