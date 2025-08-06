import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrador' | 'Técnico' | 'Atención a Cliente' | 'Supervisor';
  status: 'Activo' | 'Inactivo';
  hireDate?: string;
  photo?: string;
  phone?: string | null;
  address?: string | null;
  lastLogin?: string;
}

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  userId: number | null = null;
  user?: User;
  isEditing: boolean = false;
  originalUser?: User;

  roles = ['Administrador', 'Técnico', 'Atención a Cliente', 'Supervisor'];
  statuses = ['Activo', 'Inactivo'];

  private apiUrl = 'http://18.222.150.133/api/usuarios/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.loadUserData(this.userId);
      } else {
        this.router.navigate(['/users']);
      }
    });
  }

  loadUserData(id: number): void {
    this.http.get<any>(`${this.apiUrl}${id}/`).subscribe({
      next: apiUser => {
        this.user = this.mapApiUserToUser(apiUser);
        if (this.user) {
          this.originalUser = { ...this.user } as User;
        }
      },
      error: () => {
        alert('Usuario no encontrado.');
        this.router.navigate(['/users']);
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.originalUser) {
      this.user = { ...this.originalUser };
    }
  }

  saveUser(): void {
    if (!this.user) return;

    const payload = {
      nombre: this.user.name,
      correo: this.user.email,
      rol: this.mapRoleToApi(this.user.role),
      is_active: this.user.status === 'Activo',
      fecha_registro: this.user.hireDate,
      telefono: this.user.phone,
      direccion: this.user.address
    };

    this.http.patch(`${this.apiUrl}${this.user.id}/`, payload).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente.');
        this.isEditing = false;
        this.originalUser = { ...this.user } as User;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar usuario:', err);
        alert('No se pudo actualizar el usuario.');
      }
    });
  }

  // Cambiar estado usando PATCH
  changeUserStatus(): void {
    if (!this.user) return;

    const nuevoEstado = this.user.status === 'Activo' ? false : true;
    const nuevoEstadoTexto = nuevoEstado ? 'Activo' : 'Inactivo';

    if (confirm(`¿Cambiar el estado de ${this.user.name} a ${nuevoEstadoTexto}?`)) {
      const url = `${this.apiUrl}${this.user.id}/cambio_estatus/`;
      const payload = { is_active: nuevoEstado };

      this.http.patch(url, payload).subscribe({
        next: () => {
          alert(`Estado cambiado a ${nuevoEstadoTexto} correctamente.`);
          if (this.user) this.user.status = nuevoEstadoTexto;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cambiar estado:', err);
          let mensaje = 'No se pudo cambiar el estado del usuario.';
          if (err.error) {
            if (typeof err.error === 'string') {
              mensaje += ' Detalle: ' + err.error;
            } else if (err.error.detail) {
              mensaje += ' Detalle: ' + err.error.detail;
            } else if (err.error.message) {
              mensaje += ' Detalle: ' + err.error.message;
            } else {
              mensaje += ' Detalle: ' + JSON.stringify(err.error);
            }
          }
          alert(mensaje);
        }
      });
    }
  }

  getStatusClass(status: User['status']): string {
    switch (status) {
      case 'Activo': return 'status-success';
      case 'Inactivo': return 'status-error';
      default: return '';
    }
  }

  getRoleClass(role: User['role']): string {
    switch (role) {
      case 'Administrador': return 'role-admin';
      case 'Técnico': return 'role-technician';
      case 'Atención a Cliente': return 'role-customer-service';
      case 'Supervisor': return 'role-supervisor';
      default: return '';
    }
  }

  private mapApiUserToUser(apiUser: any): User {
    return {
      id: apiUser.id,
      name: apiUser.nombre,
      email: apiUser.correo,
      role: this.mapRole(apiUser.rol),
      status: apiUser.is_active ? 'Activo' : 'Inactivo',
      hireDate: apiUser.fecha_registro ? apiUser.fecha_registro.split('T')[0] : undefined,
      photo: apiUser.foto,
      phone: apiUser.telefono,
      address: apiUser.direccion,
      lastLogin: undefined
    };
  }

  private mapRole(apiRole: string): User['role'] {
    switch (apiRole.toLowerCase()) {
      case 'admin': return 'Administrador';
      case 'tecnico': return 'Técnico';
      case 'cliente': return 'Atención a Cliente';
      case 'supervisor': return 'Supervisor';
      default: return 'Atención a Cliente';
    }
  }

  private mapRoleToApi(role: User['role']): string {
    switch (role) {
      case 'Administrador': return 'admin';
      case 'Técnico': return 'tecnico';
      case 'Atención a Cliente': return 'cliente';
      case 'Supervisor': return 'supervisor';
      default: return 'cliente';
    }
  }

  goToUsersList(): void {
    this.router.navigate(['/users']);
  }
}
