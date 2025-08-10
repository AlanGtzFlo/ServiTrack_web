import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
<<<<<<< HEAD
import { of } from 'rxjs';

=======
import { of, throwError } from 'rxjs';

// Interfaz para definir la estructura de un servicio/ticket, ahora basada en tu API
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
interface User {
  id: number;
  nombre: string;
}

interface Service {
  id: number;
  titulo: string;
  descripcion: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Urgente';
<<<<<<< HEAD
  estado: 'Pendiente' | 'Asignado' | 'En Proceso' | 'Completado' | 'Cerrado' | 'Cancelado';
=======
  estado: 'Pendiente' | 'Asignado' | 'En Proceso' | 'Concluido' | 'Cerrado' | 'Cancelado';
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
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
<<<<<<< HEAD
  allServices: Service[] = [];
  filteredServices: Service[] = [];

  private _searchTerm: string = '';
  private _filterStatus: string = 'all'; 
  private _filterPriority: string = 'all'; 

  isLoading = true;
  apiBaseUrl = 'https://fixflow-backend.onrender.com/api/tickets/';
  private exportPdfUrl = 'https://fixflow-backend.onrender.com/api/usuarios/exportar_tickets/';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadServices();
=======
  // Ahora el arreglo de servicios se carga desde la API
  services: Service[] = [];
  searchTerm: string = '';
  filterStatus: 'all' | Service['estado'] = 'all';
  filterPriority: 'all' | Service['prioridad'] = 'all';
  isLoading = true;
  apiBaseUrl = 'https://fixflow-backend.onrender.com/api/tickets/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.http.get<Service[]>(this.apiBaseUrl)
      .pipe(
        catchError(error => {
          console.error('Error al cargar los servicios:', error);
          this.isLoading = false;
          // Retornar un observable vacío para que la aplicación no se detenga
          return of([]);
        })
      )
      .subscribe(servicesData => {
        this.services = servicesData;
        this.isLoading = false;
      });
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
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
        this.allServices = servicesData;
        this.applyFilters();
        this.isLoading = false;
      });
  }

  private applyFilters(): void {
    let result = this.allServices;

    if (this.searchTerm) {
<<<<<<< HEAD
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(service => {
        const matchesTitulo = service.titulo?.toLowerCase().includes(lowerTerm) || false;
        const matchesDescripcion = service.descripcion?.toLowerCase().includes(lowerTerm) || false;
        const matchesCreador = service.usuario_creador?.nombre?.toLowerCase().includes(lowerTerm) || false;
        const matchesTecnico = service.tecnico_asignado?.nombre?.toLowerCase().includes(lowerTerm) || false;
        
        return matchesTitulo || matchesDescripcion || matchesCreador || matchesTecnico;
      });
=======
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      result = result.filter(service =>
        service.titulo.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.descripcion.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.usuario_creador.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        (service.tecnico_asignado && service.tecnico_asignado.nombre.toLowerCase().includes(lowerCaseSearchTerm))
      );
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
    }
    
    if (this.filterStatus !== 'all') {
<<<<<<< HEAD
      const normalizedFilterStatus = this.filterStatus.toLowerCase().replace(/\s/g, '_');
      result = result.filter(s => s.estado?.toLowerCase().replace(/\s/g, '_') === normalizedFilterStatus);
=======
      result = result.filter(service => service.estado === this.filterStatus);
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
    }

    if (this.filterPriority !== 'all') {
<<<<<<< HEAD
      result = result.filter(s => s.prioridad?.toLowerCase() === this.filterPriority.toLowerCase());
=======
      result = result.filter(service => service.prioridad === this.filterPriority);
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
    }

    this.filteredServices = result;
  }

<<<<<<< HEAD
  // Función para exportar los tickets a PDF
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
        alert('Error al exportar el archivo. Por favor, inténtelo de nuevo.');
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filterStatus = 'all';
    this.filterPriority = 'all';
  }

  getStatusClass(status: Service['estado']): string {
    switch (status) {
      case 'Completado':
=======
  getStatusClass(status: Service['estado']): string {
    switch (status) {
      case 'Concluido':
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
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