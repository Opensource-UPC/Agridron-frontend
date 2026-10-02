import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';
import {PerformanceIndicator} from '../../../domain/model/performance-indicator.entity';

@Component({
  imports: [DecimalPipe, MatCardModule, TranslatePipe],
  selector: 'app-performance-indicator-list',
  styleUrl: './performance-indicator-list.css',
  templateUrl: './performance-indicator-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PerformanceIndicatorList {
  indicators: InputSignal<PerformanceIndicator[]> = input.required<PerformanceIndicator[]>();

  loading: InputSignal<boolean> = input(false);
}
