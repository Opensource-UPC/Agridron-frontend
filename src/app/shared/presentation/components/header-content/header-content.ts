import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

@Component({
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, LanguageSwitcher],
  selector: 'app-header-content',
  styleUrl: './header-content.css',
  templateUrl: './header-content.html',
})
export class HeaderContent {}
