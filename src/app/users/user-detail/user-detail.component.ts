import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth.service'; // Importa el servicio de autenticación
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  selectedFile: File | null = null; // Propiedad para la nueva imagen
  isAdmin: boolean = false; // Propiedad para el control de roles

  roles = ['Administrador', 'Técnico', 'Atención a Cliente', 'Supervisor'];
  statuses = ['Activo', 'Inactivo'];

  private apiUrl = 'https://fixflow-backend.onrender.com/api/usuarios/';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService // Inyecta el servicio de autenticación
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

    // Suscribirse al rol del usuario para actualizar el estado de 'isAdmin'
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  loadUserData(id: number): void {
    this.http.get<any>(`${this.apiUrl}${id}/`).pipe(
      catchError(() => {
        console.error('Usuario no encontrado.');
        this.router.navigate(['/users']);
        return EMPTY;
      })
    ).subscribe(apiUser => {
      this.user = this.mapApiUserToUser(apiUser);
      if (this.user) {
        this.originalUser = { ...this.user } as User;
      }
    });
  }

  toggleEditMode(): void {
    if (this.isAdmin) {
      this.isEditing = !this.isEditing;
      if (!this.isEditing && this.originalUser) {
        this.user = { ...this.originalUser };
        this.selectedFile = null; // Limpiar la selección de archivo al cancelar
      }
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Mostrar una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.user) {
          this.user.photo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  saveUser(): void {
    if (!this.user || !this.isAdmin) return;

    const formData = new FormData();
    formData.append('nombre', this.user.name);
    formData.append('correo', this.user.email);
    formData.append('rol', this.mapRoleToApi(this.user.role));
    formData.append('is_active', (this.user.status === 'Activo').toString());

    if (this.user.phone) {
      formData.append('telefono', this.user.phone);
    }
    if (this.user.address) {
      formData.append('direccion', this.user.address);
    }
    if (this.user.hireDate) {
      formData.append('fecha_registro', this.user.hireDate);
    }

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile, this.selectedFile.name);
    }

    this.http.patch(`${this.apiUrl}${this.user.id}/`, formData).subscribe({
      next: () => {
        console.log('Usuario actualizado correctamente.');
        this.isEditing = false;
        this.originalUser = { ...this.user } as User;
        this.selectedFile = null; // Reiniciar el archivo seleccionado
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al actualizar usuario:', err);
        console.error('No se pudo actualizar el usuario.');
      }
    });
  }

  changeUserStatus(): void {
    if (!this.user || !this.isAdmin) return;

    const nuevoEstado = this.user.status === 'Activo' ? false : true;
    const nuevoEstadoTexto = nuevoEstado ? 'Activo' : 'Inactivo';

    console.log(`Petición para cambiar el estado de ${this.user.name} a ${nuevoEstadoTexto}`);
    const url = `${this.apiUrl}${this.user.id}/cambio_estatus/`;
    const payload = { is_active: nuevoEstado };

    this.http.patch(url, payload).subscribe({
      next: () => {
        console.log(`Estado cambiado a ${nuevoEstadoTexto} correctamente.`);
        if (this.user) this.user.status = nuevoEstadoTexto;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cambiar estado:', err);
        console.error('No se pudo cambiar el estado del usuario.');
      }
    });
  }

  getPhotoUrl(photoPath: string | undefined): string {
    if (!photoPath) {
      return '';
    }
    // Asumiendo que la URL de base de la API es la misma
    return `https://fixflow-backend.onrender.com${photoPath}`;
  }

  getPhotoFallbackUrl(): string {
    // Puedes usar una imagen de placeholder o una de un servicio gratuito
    return 'https://placehold.co/150x150/e0e0e0/ffffff?text=U';
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
