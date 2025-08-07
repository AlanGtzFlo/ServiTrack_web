// src/app/side-bar/side-bar.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'Clientes', icon: 'people', link: '/clients' },
    { label: 'Pólizas', icon: 'description', link: '/policies' },
    { label: 'Tickets', icon: 'assignment', link: '/services' },
    { label: 'Usuarios', icon: 'account_circle', link: '/users' },
    // ¡NUEVO ELEMENTO PARA REFACCIONES!
    { label: 'Refacciones', icon: 'precision_manufacturing', link: '/refacciones' }, // Usé 'precision_manufacturing' como icono, puedes cambiarlo
    { label: 'Reportes', icon: 'bar_chart', link: '/reports' },
    { label: 'Satisfacción', icon: 'sentiment_satisfied_alt', link: '/satisfaction' }
  ];
}