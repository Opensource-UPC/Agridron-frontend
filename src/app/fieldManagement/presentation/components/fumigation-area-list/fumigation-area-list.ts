import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ParcelStore} from '../../../application/parcel.store';
import {FumigationAreaStore} from '../../../application/fumigation-area.store';
import {FumigationAreaItem} from '../fumigation-area-item/fumigation-area-item';


@Component({
  imports: [FumigationAreaItem, MatButtonModule, MatIcon, MatSelectModule, MatFormFieldModule, TranslatePipe],
  selector: "app-fumigation-area-list",
  styleUrl: "./fumigation-area-list.css",
  templateUrl: "./fumigation-area-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FumigationAreaList {
  private readonly router = inject(Router);
  private readonly parcelStore = inject(ParcelStore);
  private readonly fumigationAreaStore = inject(FumigationAreaStore);
  private readonly translate = inject(TranslateService);

  readonly parcels = this.parcelStore.parcels;

  readonly selectedParcelId = signal<number | null>(null);

  readonly fumigationAreas = computed(() => {
    const parcelId = this.selectedParcelId();
    return parcelId ? this.fumigationAreaStore.getFumigationAreasByParcelId(parcelId)() : [];
  });

  readonly loading = computed(() => this.parcelStore.loading() || this.fumigationAreaStore.loading());

  readonly error = computed(() => this.parcelStore.error() ?? this.fumigationAreaStore.error());

  readonly emptyMessage = computed(() => {
    if (this.loading()) {
      return this.translate.instant('fumigationArea.loading');
    }
    return this.selectedParcelId() ? this.translate.instant('fumigationArea.empty') : this.translate.instant('fumigationArea.selectParcelPrompt');
  });

  onParcelSelected = (parcelId: number | null): void => {
    this.selectedParcelId.set(parcelId);
  };

  onEdit = (id: number): void => {
    this.router.navigate(['/fumigation-areas', id, 'edit']).then();
  };

  newFumigationArea = (): void => {
    this.router.navigate(['/fumigation-areas/new']).then();
  };

  onDelete = (id: number): void => {
    if (!window.confirm(this.translate.instant('fumigationArea.delete-confirm'))) {
      return;
    }
    this.fumigationAreaStore.deleteFumigationArea(id);
  };
}