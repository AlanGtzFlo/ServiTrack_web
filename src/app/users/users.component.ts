// src/app/users/users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Interfaz para definir la estructura de un usuario
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrador' | 'Técnico' | 'Atención a Cliente' | 'Supervisor';
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  lastLogin: string; // Formato YYYY-MM-DD HH:MM
  imageUrl?: string; // Nuevo: URL opcional de la imagen del usuario
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // Datos simulados de usuarios (FRONT-END ÚNICAMENTE)
  users: User[] = [
    { id: 1, name: 'Admin Global', email: 'admin.global@fixflow.com', role: 'Administrador', status: 'Activo', lastLogin: '2024-06-30 14:00', imageUrl: 'https://placehold.co/100x100/A7C7E7/FFFFFF?text=AG' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos.ruiz@fixflow.com', role: 'Técnico', status: 'Activo', lastLogin: '2024-06-30 13:45', imageUrl: 'https://placehold.co/100x100/87CEEB/FFFFFF?text=CR' },
    { id: 3, name: 'Ana García', email: 'ana.garcia@fixflow.com', role: 'Técnico', status: 'Activo', lastLogin: '2024-06-29 10:30', imageUrl: 'https://placehold.co/100x100/FFD700/FFFFFF?text=AG' },
    { id: 4, name: 'María López', email: 'maria.lopez@fixflow.com', role: 'Atención a Cliente', status: 'Activo', lastLogin: '2024-06-30 11:00', imageUrl: 'https://placehold.co/100x100/98FB98/FFFFFF?text=ML' },
    { id: 5, name: 'Pedro Gómez', email: 'pedro.gomez@fixflow.com', role: 'Supervisor', status: 'Activo', lastLogin: '2024-06-28 16:00', imageUrl: 'https://placehold.co/100x100/ADD8E6/FFFFFF?text=PG' },
    { id: 6, name: 'Laura Fernández', email: 'laura.fernandez@fixflow.com', role: 'Atención a Cliente', status: 'Inactivo', lastLogin: '2024-06-15 09:00' }, // No image, will show placeholder
    { id: 7, name: 'Miguel Soto', email: 'miguel.soto@fixflow.com', role: 'Técnico', status: 'Pendiente', lastLogin: 'N/A', imageUrl: 'https://placehold.co/100x100/DDA0DD/FFFFFF?text=MS' },
  ];
  searchTerm: string = '';
  filterRole: 'all' | User['role'] = 'all';
  filterStatus: 'all' | User['status'] = 'all';

  constructor() { }

  ngOnInit(): void {
    // En un proyecto real, aquí se cargarían los usuarios desde un servicio
  }

  get filteredUsers(): User[] {
    let result = this.users;

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.role.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Filtrar por rol
    if (this.filterRole !== 'all') {
      result = result.filter(user => user.role === this.filterRole);
    }

    // Filtrar por estado
    if (this.filterStatus !== 'all') {
      result = result.filter(user => user.status === this.filterStatus);
    }

    return result;
  }

  addNewUser(): void {
    console.log('Action: Abrir formulario o modal para añadir un nuevo usuario.');
    // FRONT-END ÚNICAMENTE: Aquí iría la lógica para abrir un modal de formulario
    // o para navegar a una ruta como '/users/new'
  }

  getStatusClass(status: User['status']): string {
    switch (status) {
      case 'Activo':
        return 'status-success';
      case 'Inactivo':
        return 'status-error';
      case 'Pendiente':
        return 'status-pending';
      default:
        return '';
    }
  }

  getRoleClass(role: User['role']): string {
    switch (role) {
      case 'Administrador':
        return 'role-admin';
      case 'Técnico':
        return 'role-technician';
      case 'Atención a Cliente':
        return 'role-customer-service';
      case 'Supervisor':
      default:
        return 'role-supervisor'; // Added default for supervisor, assuming it's the last case
    }
  }
}
