import {ChangeDetectionStrategy, Component, input, InputSignal} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {LanguageSwitcher} from '../language-switcher/language-switcher';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIcon, LanguageSwitcher],
  selector: 'app-header-content',
  styleUrl: './header-content.css',
  templateUrl: './header-content.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContent {
readonly menuToggle = input.required<() => void>();
}