// src/app/app.component.ts
import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { Router, RouterOutlet, NavigationEnd } from '@angular/router'; // Importa Router y NavigationEnd
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf
import { filter } from 'rxjs/operators'; // Importa filter para filtrar eventos del router

import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { ButtonModule } from 'primeng/button'; // Mantén si lo usas en app.component.html

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // Necesario para *ngIf en el template
    RouterOutlet,
    HeaderComponent,
    SideBarComponent, // La sidebar se importará siempre, su visibilidad se controla con *ngIf
    ButtonModule // Mantén si lo usas en app.component.html
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FixFlow';
  showSidebar: boolean = false; // Controla la visibilidad de la sidebar

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Suscribirse a los eventos de navegación para controlar la visibilidad de la sidebar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // Solo nos interesan los eventos de fin de navegación
    ).subscribe((event: NavigationEnd) => {
      // Determinar si la ruta actual es una ruta pública (que no debe mostrar la sidebar)
      // Si la URL comienza con '/public' o es '/login', la sidebar no se muestra.
      this.showSidebar = !(event.urlAfterRedirects.startsWith('/public') || event.urlAfterRedirects.startsWith('/login'));
    });
  }
}