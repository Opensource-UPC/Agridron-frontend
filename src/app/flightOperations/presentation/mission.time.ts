import {toSignal} from '@angular/core/rxjs-interop';
import {interval, map} from 'rxjs';

/**
 * Creates a signal with the current time in milliseconds, refreshed every second.
 * Must be called in an injection context.
 */
export const injectNow = () =>
    toSignal(interval(1000).pipe(map(() => Date.now())), {initialValue: Date.now()});

/**
 * Formats a duration as HH:MM:SS.
 * @param ms - Duration in milliseconds.
 */
export const formatDuration = (ms: number): string => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
};