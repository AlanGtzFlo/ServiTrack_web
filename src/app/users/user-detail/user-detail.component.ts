// src/app/users/user-detail/user-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Para ngModel en el formulario

// Interfaz para usuario (consistente con users.component.ts)
interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrador' | 'Técnico' | 'Atención a Cliente' | 'Supervisor';
  status: 'Activo' | 'Inactivo' | 'Pendiente';
  lastLogin: string;
  phone?: string;
  address?: string; // Opcional: para técnicos o administradores
  hireDate?: string; // Fecha de contratación (YYYY-MM-DD)
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  userId: number | null = null;
  user: User | undefined;
  isEditing: boolean = false; // Controla si el formulario está en modo edición
  originalUser: User | undefined; // Para revertir cambios si se cancela la edición

  // Opciones para los select de rol y estado
  roles = ['Administrador', 'Técnico', 'Atención a Cliente', 'Supervisor'];
  statuses = ['Activo', 'Inactivo', 'Pendiente'];

  // Datos simulados (FRONT-END ÚNICAMENTE)
  private mockUsers: User[] = [
    { id: 1, name: 'Admin Global', email: 'admin.global@fixflow.com', role: 'Administrador', status: 'Activo', lastLogin: '2024-06-30 14:00', phone: '5512345678', address: 'Calle Ficticia #10, Colonia Central' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos.ruiz@fixflow.com', role: 'Técnico', status: 'Activo', lastLogin: '2024-06-30 13:45', phone: '5587654321', address: 'Av. Siempre Viva #42', hireDate: '2022-01-15' },
    { id: 3, name: 'Ana García', email: 'ana.garcia@fixflow.com', role: 'Técnico', status: 'Activo', lastLogin: '2024-06-29 10:30', phone: '5523456789', address: 'Blvd. Las Flores #123', hireDate: '2023-03-01' },
    { id: 4, name: 'María López', email: 'maria.lopez@fixflow.com', role: 'Atención a Cliente', status: 'Activo', lastLogin: '2024-06-30 11:00' },
    { id: 5, name: 'Pedro Gómez', email: 'pedro.gomez@fixflow.com', role: 'Supervisor', status: 'Activo', lastLogin: '2024-06-28 16:00' },
    { id: 6, name: 'Laura Fernández', email: 'laura.fernandez@fixflow.com', role: 'Atención a Cliente', status: 'Inactivo', lastLogin: '2024-06-15 09:00' },
    { id: 7, name: 'Miguel Soto', email: 'miguel.soto@fixflow.com', role: 'Técnico', status: 'Pendiente', lastLogin: 'N/A', phone: '5598765432', hireDate: '2024-05-20' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.loadUserData(this.userId);
      } else {
        console.warn('No se proporcionó un ID de usuario.');
        this.router.navigate(['/users']);
      }
    });
  }

  // FRONT-END ÚNICAMENTE: Simula la carga de datos del usuario
  private loadUserData(id: number): void {
    const foundUser = this.mockUsers.find(u => u.id === id);
    if (foundUser) {
      // Crear una copia profunda para que los cambios en el formulario no afecten directamente el original
      this.user = { ...foundUser };
      this.originalUser = { ...foundUser };
    } else {
      console.error('Usuario no encontrado para el ID:', id);
      this.router.navigate(['/users']);
    }
  }

  goToUsersList(): void {
    this.router.navigate(['/users']);
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.originalUser) {
      // Si se cancela la edición, restaurar los datos originales
      this.user = { ...this.originalUser };
    }
  }

  saveUser(): void {
    if (this.user) {
      // Aquí se enviaría la información actualizada a tu API
      console.log('Guardando usuario:', this.user);
      alert('Usuario guardado (simulado).');
      this.isEditing = false;
      this.originalUser = { ...this.user }; // Actualizar el original con los nuevos datos
      // En un caso real, recargarías el usuario o actualizarías la lista.
    }
  }

  deleteUser(): void {
    if (this.user && confirm(`¿Estás seguro de que quieres eliminar a ${this.user.name}?`)) {
      // Aquí se enviaría la solicitud de eliminación a tu API
      console.log('Eliminando usuario:', this.user.id);
      alert('Usuario eliminado (simulado).');
      this.router.navigate(['/users']); // Volver al listado después de eliminar
    }
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
        return 'role-supervisor';
      default:
        return '';
    }
  }
}