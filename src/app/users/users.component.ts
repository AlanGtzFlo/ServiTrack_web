import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Interfaz para el usuario, actualizada para coincidir con el HTML
export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  is_active: boolean;
  foto?: string; // Se agregó la propiedad 'foto'
  fecha_registro: string; // Se agregó la propiedad 'fecha_registro'
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // La URL de la API se define aquí, como en tu NewUserComponent
  private apiUrl = 'https://fixflow-backend.onrender.com/api/usuarios/';

  allUsers: User[] = [];
  filteredUsers: User[] = [];

  searchTerm: string = '';
  filterRole: string = 'all';
  filterStatus: string = 'all';

  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Inyectamos HttpClient directamente en el constructor
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  /**
   * Obtiene la lista de usuarios de la API usando HttpClient.
   */
  fetchUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.allUsers = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Hubo un error al cargar los usuarios. Por favor, intenta de nuevo.';
        this.isLoading = false;
        console.error('Error al obtener los usuarios de la API:', error);
      }
    });
  }

  /**
   * Aplica los filtros de búsqueda, rol y estado a la lista de usuarios.
   */
  applyFilters(): void {
    let result = this.allUsers;

    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      result = result.filter(user =>
        user.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.correo.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (this.filterRole !== 'all') {
      result = result.filter(user => user.rol.toLowerCase() === this.filterRole.toLowerCase());
    }

    if (this.filterStatus !== 'all') {
      const isActive = this.filterStatus === 'Activo';
      result = result.filter(user => user.is_active === isActive);
    }

    this.filteredUsers = result;
  }

  /**
   * Determina la clase CSS para el estado del usuario, usando 'is_active'.
   */
  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  /**
   * Determina la clase CSS para el rol del usuario, usando 'rol'.
   */
  getRoleClass(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'tecnico':
        return 'role-technician';
      case 'atención a cliente':
        return 'role-customer-service';
      case 'supervisor':
        return 'role-supervisor';
      default:
        return '';
    }
  }

  // Navega a la página de nuevo usuario, como en tu ejemplo
  addNewUser(): void {
    this.router.navigate(['/users/new']);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterRole = 'all';
    this.filterStatus = 'all';
    this.applyFilters();
  }
}