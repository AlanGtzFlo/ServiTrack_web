// src/app/inicio/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Necesario si hay enlaces en el dashboard

@Component({
  selector: 'app-dashboard',
  standalone: true, // ¡Importante si usas standalone components!
  imports: [CommonModule, RouterModule], // Asegúrate de importar CommonModule y RouterModule
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = 'Compañero'; // Simulación de nombre de usuario
  userMatricula: string = 'FX-12345'; // Simulación de matrícula
  ticketsToResolve: number = 5;

  // Datos simulados para las tarjetas de recordatorio.
  // En un proyecto real, estas imágenes estarían en `src/assets/images/`
  toolsReminder = {
    image: 'images/tools-box.png',
    text: 'Recuerda llevar tu herramienta'
  };

  safetyReminder = {
    image: 'images/safety-gear.png',
    text: 'Usa tu equipo de protección personal'
  };

  constructor() { }

  ngOnInit(): void {
    // Lógica para cargar datos del dashboard, si fuera de un servicio (en un proyecto real)
  }

  // Puedes añadir métodos si los botones del dashboard tienen acciones
  viewTickets(): void {
    console.log('Navegando a la sección de tickets...');
    // Ejemplo de navegación:
    // this.router.navigate(['/services'], { queryParams: { status: 'pending' } });
  }

  openNewServiceForm(): void {
    console.log('Abriendo formulario para nuevo servicio...');
  }
}