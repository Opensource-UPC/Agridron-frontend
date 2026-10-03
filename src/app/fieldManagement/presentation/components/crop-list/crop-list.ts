import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CropStore} from '../../../application/crop.store';
import {CropItem} from '../crop-item/crop-item';


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

  readonly crops = this.cropStore.crops;

  readonly loading = this.cropStore.loading;

  readonly error = this.cropStore.error;

  readonly emptyMessage = computed(() => {
    if (this.loading()) {
      return this.translate.instant('crop.loading');
    }
    return this.translate.instant('crop.empty');
  });

  newCrop = (): void => {
    this.router.navigate(['/crops/new']).then();
  };

  editCrop = (id: number): void => {
    this.router.navigate(['/crops', id, 'edit']).then();
  };

  deleteCrop = (id: number): void => {
    if (!window.confirm(this.translate.instant('crop.delete-confirm'))) {
      return;
    }
    this.cropStore.deleteCrop(id);
  };
}