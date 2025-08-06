// src/app/users/users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importa el servicio y la interfaz que definimos para la API
import { UserService, User } from '../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // Almacena todos los usuarios obtenidos de la API
  allUsers: User[] = [];
  // La lista que se muestra en el HTML, después de aplicar filtros
  filteredUsers: User[] = [];
  
  // Variables para los filtros
  searchTerm: string = '';
  filterRole: string = 'all';
  filterStatus: string = 'all';

  // Variables para la experiencia de usuario (UX)
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Inyectamos el UserService en el constructor
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  /**
   * Obtiene la lista de usuarios de la API usando el UserService.
   */
  fetchUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.allUsers = data;
        // Se aplica la lógica de filtrado inicial después de obtener los datos
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
   * Se llama cada vez que un filtro cambia.
   */
  applyFilters(): void {
    let result = this.allUsers;

    // 1. Filtrar por término de búsqueda (nombre o correo)
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      result = result.filter(user =>
        user.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.correo.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // 2. Filtrar por rol
    if (this.filterRole !== 'all') {
      result = result.filter(user => user.rol.toLowerCase() === this.filterRole.toLowerCase());
    }

    // 3. Filtrar por estado
    if (this.filterStatus !== 'all') {
      const isActive = this.filterStatus === 'Activo';
      result = result.filter(user => user.is_active === isActive);
    }

    this.filteredUsers = result;
  }

  /**
   * Determina la clase CSS para el estado del usuario.
   * @param status El estado booleano de is_active.
   * @returns La clase CSS correspondiente.
   */
  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  /**
   * Determina la clase CSS para el rol del usuario.
   * @param role El rol del usuario.
   * @returns La clase CSS correspondiente.
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

  /**
   * Lógica para añadir un nuevo usuario.
   */
  addNewUser(): void {
    // Esta lógica se manejaría con el RouterLink en el template, pero puedes
    // agregar más funcionalidad aquí si es necesario (ej. abrir un modal).
    console.log('Navegando a la página de nuevo usuario.');
  }

  /**
   * Limpia todos los filtros y actualiza la vista.
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.filterRole = 'all';
    this.filterStatus = 'all';
    this.applyFilters();
  }
}
