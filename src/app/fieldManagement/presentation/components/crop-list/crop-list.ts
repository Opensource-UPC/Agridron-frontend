import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CropStore} from '../../../application/crop.store';
import {CropItem} from '../crop-item/crop-item';
import {ConfirmDialogService} from '../../../../shared/presentation/components/confirm-dialog/confirm-dialog.service';


@Component({
  imports: [CropItem, MatButtonModule, MatIcon, TranslatePipe],
  selector: "app-crop-list",
  styleUrl: "./crop-list.css",
  templateUrl: "./crop-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CropList {
  private readonly router = inject(Router);
  private readonly cropStore = inject(CropStore);
  private readonly translate = inject(TranslateService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  readonly crops = this.cropStore.crops;

  readonly loading = this.cropStore.loading;

  readonly error = this.cropStore.error;

  newCrop = (): void => {
    this.router.navigate(['/crops/new']).then();
  };

  editCrop = (id: number): void => {
    this.router.navigate(['/crops', id, 'edit']).then();
  };

  deleteCrop = (id: number): void => {
    this.confirmDialog.confirm({
      title: this.translate.instant('crop.deleteTitle'),
      message: this.translate.instant('crop.delete-confirm'),
      confirmLabel: this.translate.instant('crop.button.delete'),
      cancelLabel: this.translate.instant('crop.form.cancel')
    }).subscribe(confirmed => {
      if (confirmed) {
        this.cropStore.deleteCrop(id);
      }
    });
  };
}
