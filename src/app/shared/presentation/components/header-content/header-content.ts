import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, LanguageSwitcher, RouterLink, RouterLinkActive, TranslatePipe],
  selector: 'app-header-content',
  styleUrl: './header-content.css',
  templateUrl: './header-content.html',
})
export class HeaderContent {
  options = signal([
    {link: '/farms', label: 'option.farm'},
    {link: '/analytics', label: 'option.analytics'},
  ]);
}