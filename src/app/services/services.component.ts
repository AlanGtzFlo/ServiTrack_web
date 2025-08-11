import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../auth.service';

// Interfaz para el usuario, no se requiere cambio
interface User {
  id: number;
  nombre: string;
}

// Interfaz para el servicio, no se requiere cambio
interface Service {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  estado: 'Pendiente' | 'Asignado' | 'En Proceso' | 'Concluido' | 'Cerrado' | 'Cancelado';
  fecha_limite: string | null;
  ubicacion: string | null;
  usuario_creador: User;
  tecnico_asignado: User | null;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  allServices: Service[] = [];
  filteredServices: Service[] = [];

  private _searchTerm: string = '';
  private _filterStatus: string = 'all';
  private _filterPriority: string = 'all';

  isLoading = true;
  private apiBaseUrl = 'https://fixflow-backend.onrender.com/api/tickets/';
  private exportPdfUrl = 'https://fixflow-backend.onrender.com/api/tickets/exportar_tickets/';

  isAdmin: boolean = false;
  currentUserId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
    this.authService.currentUserId$.subscribe(id => {
      this.currentUserId = id;
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(value: string) {
    this._searchTerm = value;
    this.applyFilters();
  }

  get filterStatus(): string {
    return this._filterStatus;
  }
  set filterStatus(value: string) {
    this._filterStatus = value;
    this.applyFilters();
  }

  get filterPriority(): string {
    return this._filterPriority;
  }
  set filterPriority(value: string) {
    this._filterPriority = value;
    this.applyFilters();
  }

  // Se eliminó filterTechnicianId y su lógica asociada.

  loadServices(): void {
    this.isLoading = true;
    this.http.get<Service[]>(this.apiBaseUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar los servicios:', error);
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe(servicesData => {
        // La lógica de filtrado por técnico se realiza aquí.
        if (this.isAdmin) {
          this.allServices = servicesData;
        } else if (this.currentUserId !== null) {
          this.allServices = servicesData.filter(service => 
            service.tecnico_asignado && service.tecnico_asignado.id === this.currentUserId
          );
        } else {
          this.allServices = [];
        }
        this.applyFilters();
        this.isLoading = false;
      });
  }

  private applyFilters(): void {
    let result = this.allServices;

    if (this.searchTerm) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(service => {
        const matchesTitulo = service.titulo?.toLowerCase().includes(lowerTerm) || false;
        const matchesDescripcion = service.descripcion?.toLowerCase().includes(lowerTerm) || false;
        const matchesCreador = service.usuario_creador?.nombre?.toLowerCase().includes(lowerTerm) || false;
        const matchesTecnico = service.tecnico_asignado?.nombre?.toLowerCase().includes(lowerTerm) || false;

        return matchesTitulo || matchesDescripcion || matchesCreador || matchesTecnico;
      });
    }

    if (this.filterStatus !== 'all') {
      result = result.filter(s => s.estado?.toLowerCase().replace(/\s/g, '_') === this.filterStatus.toLowerCase().replace(/\s/g, '_'));
    }

    if (this.filterPriority !== 'all') {
      result = result.filter(s => s.prioridad?.toLowerCase() === this.filterPriority.toLowerCase());
    }

    this.filteredServices = result;
  }

  exportTicketsToPdf(): void {
    this.http.get(this.exportPdfUrl, { responseType: 'blob' }).subscribe({
      next: (data: Blob) => {
        const downloadUrl = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'tickets.pdf';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: err => {
        console.error('Error al exportar los tickets a PDF:', err);
        console.log('Error al exportar el archivo. Por favor, inténtelo de nuevo.');
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'all';
    this.filterPriority = 'all';
    // No se necesita recargar la lista completa si el filtrado se hace en el cliente.
    this.applyFilters();
  }

  getStatusClass(status: Service['estado']): string {
    switch (status) {
      case 'Concluido':
      case 'Cerrado':
        return 'status-success';
      case 'Pendiente':
      case 'Asignado':
      case 'En Proceso':
        return 'status-pending';
      case 'Cancelado':
        return 'status-error';
      default:
        return '';
    }
  }

  getPriorityClass(priority: Service['prioridad']): string {
    switch (priority) {
      case 'Urgente':
        return 'priority-urgent';
      case 'Alta':
        return 'priority-high';
      case 'Media':
        return 'priority-medium';
      case 'Baja':
        return 'priority-low';
      default:
        return '';
    }
  }
}