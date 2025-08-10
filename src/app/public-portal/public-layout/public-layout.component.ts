// src/app/public-portal/public-layout/public-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas como ngFor, ngIf
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // ¡Importa RouterOutlet, RouterLink y RouterLinkActive!

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,        // Necesario para las directivas routerLink
    RouterLinkActive,  // Necesario para la directiva routerLinkActive
    RouterOutlet       // ¡Este es el que te faltaba!
  ],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss']
})
export class PublicLayoutComponent implements OnInit {

  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }
}