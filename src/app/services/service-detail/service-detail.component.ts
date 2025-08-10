// src/app/services/service-detail/service-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
<<<<<<< HEAD
import { of, throwError } from 'rxjs';

// URL base para todas las llamadas a la API
const API_BASE_URL = 'https://fixflow-backend.onrender.com/api/';

// Interfaces actualizadas para reflejar la estructura de la API
interface User {
  id: number;
  nombre: string;
  rol: string; // Asumimos un campo 'rol' para identificar técnicos
=======
import { forkJoin, of, throwError } from 'rxjs';

// Interfaces para reflejar la estructura de la API
interface User {
  id: number;
  nombre: string;
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
}

interface Ubicacion {
  id: number;
  nombre: string;
}

interface Service {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: 'baja' | 'media' | 'alta';
<<<<<<< HEAD
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cerrado'; // Corregido 'en_proceso'
  fecha_creacion: string;
  fecha_limite: string | null;
  ubicacion: number | null; // Es un ID numérico
  usuario_creador: number; // Es un ID numérico
  tecnico_asignado: number | null; // Es un ID numérico
=======
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cerrado'; 
  fecha_creacion: string;
  fecha_limite: string | null;
  ubicacion: number | null; // Ahora es solo el ID de la ubicación
  usuario_creador: number; 
  tecnico_asignado: number | null;
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
}

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  serviceId: number | null = null;
  service: Service | undefined;
  isLoading = true;
<<<<<<< HEAD

  // Listas para los dropdowns
  allUsers: User[] = [];
  technicians: User[] = [];
  locations: Ubicacion[] = [];

  // Propiedades para la vista
  creatorName: string = '';
  assignedTechnicianName: string = '';
  locationName: string = '';

  // Variables para el modo de edición
  isEditing = false;
  editedTitle = '';
  editedDescription = '';
  editedLocation: number | null = null;
  editedDueDate = '';
  editedPriority: Service['prioridad'] = 'baja';
  editedStatus: Service['estado'] = 'pendiente';
  editedTechnicianId: number | null = null;

=======
  apiBaseUrl = 'https://fixflow-backend.onrender.com/api/tickets/';
  usersApiUrl = 'https://fixflow-backend.onrender.com/api/usuarios/';
  locationsApiUrl = 'https://fixflow-backend.onrender.com/api/ubicaciones/';
  
  users: User[] = [];
  ubicaciones: Ubicacion[] = [];
  creatorName: string = 'Cargando...';
  locationName: string = 'Cargando...';

  isEditing = false;
  editedTitle = '';
  editedDescription = '';
  editedDueDate = '';
  editedPriority: Service['prioridad'] = 'baja';
  editedStatus: Service['estado'] = 'pendiente';
  selectedTechnicianId: number | null = null;
  selectedLocationId: number | null = null;

>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.serviceId = Number(params.get('id'));
      if (this.serviceId) {
        this.loadInitialData(this.serviceId);
      } else {
        console.warn('No se proporcionó un ID de servicio.');
        this.router.navigate(['/services']);
      }
    });
  }

<<<<<<< HEAD
  // Carga todos los datos necesarios en paralelo para optimizar
  async loadInitialData(id: number): Promise<void> {
    this.isLoading = true;
    try {
      // Usamos Promise.all para hacer las llamadas a la API de forma simultánea
      const [serviceData, usersData, locationsData] = await Promise.all([
        this.http.get<Service>(`${API_BASE_URL}tickets/${id}`).toPromise(),
        this.http.get<User[]>(`${API_BASE_URL}usuarios/`).toPromise(),
        this.http.get<Ubicacion[]>(`${API_BASE_URL}ubicaciones/`).toPromise()
      ]);

      if (serviceData) this.service = serviceData;
      if (usersData) {
        this.allUsers = usersData;
        this.technicians = usersData.filter(user => user.rol === 'tecnico');
      }
      if (locationsData) this.locations = locationsData;
      
      this.updateDisplayNames();
    } catch (error) {
      console.error('Error al cargar los datos iniciales:', error);
      // Aquí podrías redirigir o mostrar un mensaje de error
      this.router.navigate(['/services']);
    } finally {
      this.isLoading = false;
    }
  }

  // Actualiza los nombres mostrados en la vista a partir de los IDs
  updateDisplayNames(): void {
    if (this.service) {
      const creator = this.allUsers.find(u => u.id === this.service?.usuario_creador);
      this.creatorName = creator ? creator.nombre : 'Desconocido';

      const technician = this.allUsers.find(u => u.id === this.service?.tecnico_asignado);
      this.assignedTechnicianName = technician ? technician.nombre : 'Sin asignar';

      const location = this.locations.find(l => l.id === this.service?.ubicacion);
      this.locationName = location ? location.nombre : 'Sin especificar';
    }
  }

  enterEditMode(): void {
    if (this.service) {
      this.isEditing = true;
      // Inicializa las variables de edición con los valores actuales del servicio
      this.editedTitle = this.service.titulo;
      this.editedDescription = this.service.descripcion;
      this.editedLocation = this.service.ubicacion;
      this.editedDueDate = this.service.fecha_limite || '';
      this.editedPriority = this.service.prioridad;
      this.editedStatus = this.service.estado;
      this.editedTechnicianId = this.service.tecnico_asignado;
    }
=======
  loadInitialData(id: number): void {
    this.isLoading = true;
    forkJoin({
      users: this.http.get<User[]>(this.usersApiUrl),
      ubicaciones: this.http.get<Ubicacion[]>(this.locationsApiUrl),
      service: this.http.get<Service>(`${this.apiBaseUrl}${id}/`)
    }).pipe(
      catchError(error => {
        console.error('Error al cargar datos iniciales:', error);
        this.router.navigate(['/services']);
        return throwError(() => new Error('Error al cargar datos'));
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(({ users, ubicaciones, service }) => {
      this.users = users;
      this.ubicaciones = ubicaciones;
      this.service = service;
      this.setInitialValues();
    });
  }

  setInitialValues(): void {
    if (this.service) {
      const creator = this.users.find(u => u.id === this.service!.usuario_creador);
      this.creatorName = creator ? creator.nombre : 'Desconocido';

      const location = this.ubicaciones.find(u => u.id === this.service!.ubicacion);
      this.locationName = location ? location.nombre : 'Desconocido';
      this.selectedLocationId = this.service.ubicacion;

      this.editedTitle = this.service.titulo;
      this.editedDescription = this.service.descripcion;
      this.editedDueDate = this.service.fecha_limite || '';
      this.editedPriority = this.service.prioridad;
      this.editedStatus = this.service.estado;
      this.selectedTechnicianId = this.service.tecnico_asignado;
    }
  }

  enterEditMode(): void {
    this.isEditing = true;
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
  }

  cancelEditMode(): void {
    this.isEditing = false;
<<<<<<< HEAD
  }

  saveChanges(): void {
    if (!this.service || !this.serviceId) {
      console.error('Servicio o ID de servicio no válido.');
      return;
    }

    const payload: Partial<Service> = {
      titulo: this.editedTitle,
      descripcion: this.editedDescription,
      ubicacion: this.editedLocation,
      fecha_limite: this.editedDueDate === '' ? null : this.editedDueDate,
      prioridad: this.editedPriority,
      estado: this.editedStatus,
      tecnico_asignado: this.editedTechnicianId
    };

    this.updateService(payload, 'Los campos del servicio han sido actualizados.');
=======
    this.setInitialValues(); // Restaurar valores originales
  }

  saveChanges(): void {
    if (!this.service) {
      console.error('Servicio no cargado.');
      return;
    }

    const payload: Partial<Service> = {};
    let changesMade = false;

    if (this.editedTitle !== this.service.titulo) { payload.titulo = this.editedTitle; changesMade = true; }
    if (this.editedDescription !== this.service.descripcion) { payload.descripcion = this.editedDescription; changesMade = true; }
    const editedDueDateValue = this.editedDueDate === '' ? null : this.editedDueDate;
    if (editedDueDateValue !== this.service.fecha_limite) { payload.fecha_limite = editedDueDateValue; changesMade = true; }
    if (this.editedPriority !== this.service.prioridad) { payload.prioridad = this.editedPriority; changesMade = true; }
    if (this.editedStatus !== this.service.estado) { payload.estado = this.editedStatus; changesMade = true; }
    
    if (this.selectedTechnicianId !== this.service.tecnico_asignado) {
      payload.tecnico_asignado = this.selectedTechnicianId;
      changesMade = true;
    }
    
    if (this.selectedLocationId !== this.service.ubicacion) {
      payload.ubicacion = this.selectedLocationId;
      changesMade = true;
    }

    if (changesMade) {
      this.updateService(payload, 'Los campos del servicio han sido actualizados.');
    } else {
      console.log('No se hicieron cambios.');
    }
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
    this.isEditing = false;
  }

  private updateService(payload: Partial<Service>, successMessage: string): void {
    if (!this.serviceId || Object.keys(payload).length === 0) return;

<<<<<<< HEAD
    this.http.patch(`${API_BASE_URL}tickets/${this.serviceId}/`, payload)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar el servicio:', error);
=======
    this.http.patch(`${this.apiBaseUrl}${this.serviceId}/`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al actualizar el servicio:', error);
          if (error.error && typeof error.error === 'object') {
            console.error('Detalles del error del backend:', JSON.stringify(error.error));
          } else if (error.error) {
            console.error('Mensaje de error del backend:', error.error);
          }
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          console.log(successMessage, response);
          this.loadInitialData(this.serviceId!);
        }
      });
  }

  goToServicesList(): void {
    this.router.navigate(['/services']);
  }

  getPriorityClass(priority: Service['prioridad']): string {
    switch (priority) {
      case 'alta': return 'priority-high';
      case 'media': return 'priority-medium';
      case 'baja': return 'priority-low';
      default: return '';
<<<<<<< HEAD
    }
  }

  getStatusClass(status: Service['estado']): string {
    switch (status) {
      case 'completado':
      case 'cerrado':
        return 'status-success';
      default:
        return '';
    }
  }
=======
    }
  }

  getStatusClass(status: Service['estado']): string {
    switch (status) {
      case 'completado':
      case 'cerrado':
        return 'status-success';
      case 'en_proceso':
        return 'status-in-progress';
      case 'pendiente':
        return 'status-pending';
      default: return '';
    }
  }
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
}