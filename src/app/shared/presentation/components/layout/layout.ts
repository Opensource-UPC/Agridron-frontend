import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderContent } from '../header-content/header-content';
import { FooterContent } from '../footer-content/footer-content';


@Component({
  imports: [HeaderContent, FooterContent, RouterOutlet],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
}