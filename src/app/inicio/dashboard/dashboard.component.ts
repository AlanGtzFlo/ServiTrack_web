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
  userName: string = 'Compañero'; // Valor por defecto
  userMatricula: string = 'N/A'; // Valor por defecto para el rol/matrícula
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
    this.loadUserInfo(); // Carga la información del usuario al inicializar el componente
  }

  /**
   * Carga la información del usuario desde localStorage.
   * Asume que el login guarda un objeto JSON con 'nombre' y 'rol' en 'user_data'.
   */
  loadUserInfo(): void {
    const userDataString = localStorage.getItem('user_data');
    console.log('DashboardComponent: Valor de user_data en localStorage:', userDataString); // Debug: qué hay en localStorage
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        console.log('DashboardComponent: user_data parseado:', userData); // Debug: objeto parseado

        // CORRECCIÓN: Acceder a las propiedades 'nombre' y 'rol' DENTRO del objeto 'user'
        if (userData.user && userData.user.nombre) {
          this.userName = userData.user.nombre;
          console.log('DashboardComponent: Nombre de usuario asignado:', this.userName);
        } else {
          console.log('DashboardComponent: La propiedad "nombre" no se encontró en userData.user.');
        }

        if (userData.user && userData.user.rol) {
          this.userMatricula = userData.user.rol;
          console.log('DashboardComponent: Rol de usuario asignado:', this.userMatricula);
        } else {
          console.log('DashboardComponent: La propiedad "rol" no se encontró en userData.user.');
        }
      } catch (e) {
        console.error('DashboardComponent: Error al parsear user_data de localStorage:', e);
        // Podrías limpiar el localStorage si el formato es incorrecto
        localStorage.removeItem('user_data');
      }
    } else {
      console.log('DashboardComponent: No se encontró user_data en localStorage. Usuario no logueado o sesión expirada.');
      // Opcional: Redirigir al login si no hay datos de usuario
      // this.router.navigate(['/login']);
    }
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