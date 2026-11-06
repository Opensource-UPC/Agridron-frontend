import {inject, Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ConfirmDialog, ConfirmDialogData} from './confirm-dialog';

/**
 * Opens the shared confirmation dialog for destructive actions.
 */
@Injectable({providedIn: 'root'})
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  /**
   * @param data - Already translated texts of the dialog.
   * @returns Emits `true` only when the user confirms.
   */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialog, {data, width: '400px', maxWidth: 'calc(100vw - 32px)', panelClass: 'agd-dialog'})
      .afterClosed()
      .pipe(map(result => result === true));
  }
}
