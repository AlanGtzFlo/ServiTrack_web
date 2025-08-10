import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { forkJoin, of, throwError } from 'rxjs';

interface User {
  id: number;
  nombre: string;
  rol?: string;
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
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cerrado'; 
  fecha_creacion: string;
  fecha_limite: string | null;
  ubicacion: number | null;
  usuario_creador: number; 
  tecnico_asignado: number | null;
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

      const technician = this.users.find(u => u.id === this.service!.tecnico_asignado);
      this.assignedTechnicianName = technician ? technician.nombre : 'Sin asignar';

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
  }

  cancelEditMode(): void {
    this.isEditing = false;
    this.setInitialValues();
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
    if (this.selectedTechnicianId !== this.service.tecnico_asignado) { payload.tecnico_asignado = this.selectedTechnicianId; changesMade = true; }
    if (this.selectedLocationId !== this.service.ubicacion) { payload.ubicacion = this.selectedLocationId; changesMade = true; }

    if (changesMade) {
      this.updateService(payload, 'Los campos del servicio han sido actualizados.');
    } else {
      console.log('No se hicieron cambios.');
    }
    this.isEditing = false;
  }

  private updateService(payload: Partial<Service>, successMessage: string): void {
    if (!this.serviceId || Object.keys(payload).length === 0) return;

    this.http.patch(`${this.apiBaseUrl}${this.serviceId}/`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al actualizar el servicio:', error);
          if (error.error && typeof error.error === 'object') {
            console.error('Detalles del error del backend:', JSON.stringify(error.error));
          } else if (error.error) {
            console.error('Mensaje de error del backend:', error.error);
          }
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
}
