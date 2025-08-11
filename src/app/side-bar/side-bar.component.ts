import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service'; // Asegúrate de que la ruta sea correcta

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  navItems: NavItem[] = [];

  // Define todos los ítems de navegación posibles
  private allNavItems = [
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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del rol para actualizar el menú dinámicamente
    this.authService.userRole$.subscribe(role => {
      if (role === 'admin') {
        // Si es admin, muestra todos los ítems
        this.navItems = this.allNavItems;
      } else if (role === 'tecnico') {
        // Si es técnico, filtra solo las opciones que no debe ver
        this.navItems = this.allNavItems.filter(item =>
          item.label !== 'Ubicaciones' && item.label !== 'Satisfacción'
        );
      } else {
        // Si no hay rol (o el usuario no está logueado), no muestra nada
        this.navItems = [];
      }
    });
  }

  logout(): void {
    this.authService.logoutAndClearData();
    // Se fuerza un refresh completo de la página para asegurar que no queda ningún estado anterior.
    window.location.href = '/login';
  }
}
