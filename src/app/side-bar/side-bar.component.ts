import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
  constructor(private router: Router) {}

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    { label: 'Clientes', icon: 'people', link: '/clients' },
    { label: 'Pólizas', icon: 'description', link: '/policies' },
    { label: 'Tickets', icon: 'assignment', link: '/services' },
    { label: 'Usuarios', icon: 'account_circle', link: '/users' },
    { label: 'Refacciones', icon: 'precision_manufacturing', link: '/refacciones' },
    { label: 'Ubicaciones', icon: 'location_on', link: '/ubicaciones' },
    { label: 'Reportes', icon: 'bar_chart', link: '/reports' },
    { label: 'Satisfacción', icon: 'sentiment_satisfied_alt', link: '/satisfaction' }
  ];

  logout() {
    localStorage.removeItem('access_token'); // 1. Eliminar token
    this.router.navigate(['/login']);        // 2. Redirigir a login
  }
}
