import { Component } from '@angular/core';
import { inject, OnInit, Signal } from '@angular/core';
import { HeaderContent } from '../header-content/header-content';
import { FooterContent } from '../footer-content/footer-content';


@Component({
  imports: [HeaderContent, FooterContent],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout implements OnInit {


  ngOnInit(): void {

  }
}
