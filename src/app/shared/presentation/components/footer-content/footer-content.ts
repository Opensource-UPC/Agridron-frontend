import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  imports: [TranslatePipe],
  selector: 'app-footer-content',
  styleUrl: './footer-content.css',
  templateUrl: './footer-content.html',
})
export class FooterContent {}
