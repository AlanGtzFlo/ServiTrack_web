// src/app/services/services.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Interfaz para definir la estructura de un servicio/ticket
interface Service {
  id: number;
  title: string;
  description: string;
  clientName: string;
  clientId: number; // Para navegar al detalle del cliente
  policyNumber?: string; // Opcional, si está asociado a una póliza
  policyId?: number; // Para navegar al detalle de la póliza
  type: 'Correctivo' | 'Preventivo' | 'Instalación' | 'Inspección';
  priority: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  status: 'Pendiente' | 'Asignado' | 'En Proceso' | 'Concluido' | 'Cerrado' | 'Cancelado';
  reportedDate: string; // Fecha de reporte (YYYY-MM-DD)
  assignedTechnician?: string; // Técnico asignado
  dueDate?: string; // Fecha límite (YYYY-MM-DD)
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  // Datos simulados de servicios (FRONT-END ÚNICAMENTE)
  services: Service[] = [
    {
      id: 1, title: 'Fuga en sistema de riego', description: 'Reportada fuga de agua en el sistema de riego del jardín principal.',
      clientName: 'Transportes El Águila S.A. de C.V.', clientId: 1, type: 'Correctivo', priority: 'Alta', status: 'Pendiente', reportedDate: '2024-06-28'
    },
    {
      id: 2, title: 'Mantenimiento de aire acondicionado', description: 'Mantenimiento preventivo anual de las unidades de A/C de oficina central.',
      clientName: 'Transportes El Águila S.A. de C.V.', clientId: 1, policyNumber: 'POL-AGUILA-001', policyId: 101, type: 'Preventivo', priority: 'Media', status: 'Asignado', reportedDate: '2024-06-25', assignedTechnician: 'Carlos Ruiz', dueDate: '2024-07-05'
    },
    {
      id: 3, title: 'Instalación de nueva luminaria', description: 'Instalar 5 nuevas luminarias LED en el almacén de productos terminados.',
      clientName: 'Comercializadora del Valle S. de R.L. de C.V.', clientId: 2, type: 'Instalación', priority: 'Media', status: 'En Proceso', reportedDate: '2024-06-20', assignedTechnician: 'Ana García', dueDate: '2024-07-01'
    },
    {
      id: 4, title: 'Inspección de seguridad en bodegas', description: 'Revisión y certificación de sistemas de seguridad y alarmas.',
      clientName: 'Servicios Integrales Omega S.C.', clientId: 4, policyNumber: 'POL-OMEGA-001', policyId: 104, type: 'Inspección', priority: 'Baja', status: 'Concluido', reportedDate: '2024-06-10', assignedTechnician: 'Juan Pérez'
    },
    {
      id: 5, title: 'Reparación de elevador de carga', description: 'Elevador de carga con ruido anormal y movimiento errático. Urgente.',
      clientName: 'Constructora Alfa del Sureste S.A.', clientId: 3, type: 'Correctivo', priority: 'Urgente', status: 'Cerrado', reportedDate: '2024-06-05', assignedTechnician: 'Miguel Soto'
    },
    {
      id: 6, title: 'Revisión sistema eléctrico', description: 'Falla intermitente en el suministro eléctrico de la zona de empaque.',
      clientName: 'Logística Rápida Express', clientId: 5, type: 'Correctivo', priority: 'Alta', status: 'Pendiente', reportedDate: '2024-06-30'
    },
  ];
  searchTerm: string = '';
  filterStatus: 'all' | Service['status'] = 'all';
  filterPriority: 'all' | Service['priority'] = 'all';

  constructor() { }

  ngOnInit(): void {
    // En un proyecto real, aquí se cargarían los servicios desde un servicio
  }

  get filteredServices(): Service[] {
    let result = this.services;

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      result = result.filter(service =>
        service.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.clientName.toLowerCase().includes(lowerCaseSearchTerm) ||
        (service.policyNumber && service.policyNumber.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (service.assignedTechnician && service.assignedTechnician.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Filtrar por estado
    if (this.filterStatus !== 'all') {
      result = result.filter(service => service.status === this.filterStatus);
    }

    // Filtrar por prioridad
    if (this.filterPriority !== 'all') {
      result = result.filter(service => service.priority === this.filterPriority);
    }

    return result;
  }

  addNewService(): void {
    console.log('Action: Abrir formulario o modal para añadir un nuevo servicio/ticket.');
    // FRONT-END ÚNICAMENTE: Aquí iría la lógica para abrir un modal de formulario
    // o para navegar a una ruta como '/services/new'
  }

  getStatusClass(status: Service['status']): string {
    switch (status) {
      case 'Concluido':
        return 'status-success';
      case 'Cerrado': // Para un estado finalizado que no es éxito puro
        return 'status-success'; // O podrías tener 'status-completed-gray'
      case 'Pendiente':
      case 'Asignado':
      case 'En Proceso':
        return 'status-pending'; // Usamos amarillo/naranja para progreso/pendiente
      case 'Cancelado':
        return 'status-error'; // Rojo para cancelado
      default:
        return '';
    }
  }

  getPriorityClass(priority: Service['priority']): string {
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