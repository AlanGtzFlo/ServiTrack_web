// src/app/services/services.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

// Interfaz para definir la estructura de un servicio/ticket, ahora basada en tu API
interface User {
  id: number;
  nombre: string;
}

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
  }

  get filteredServices(): Service[] {
    let result = this.services;

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      result = result.filter(service =>
        service.titulo.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.descripcion.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.usuario_creador.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        (service.tecnico_asignado && service.tecnico_asignado.nombre.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Filtrar por estado
    if (this.filterStatus !== 'all') {
      result = result.filter(service => service.estado === this.filterStatus);
    }

    // Filtrar por prioridad
    if (this.filterPriority !== 'all') {
      result = result.filter(service => service.prioridad === this.filterPriority);
    }

    return result;
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