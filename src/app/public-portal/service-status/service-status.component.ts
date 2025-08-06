// src/app/public-portal/service-status/service-status.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ServiceStatus {
  trackingCode: string;
  serviceType: string;
  status: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  assignedTechnician?: string;
  lastUpdate: string;
  estimatedCompletion?: string;
  notes?: string;
}

@Component({
  selector: 'app-service-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-status.component.html',
  styleUrls: ['./service-status.component.scss']
})
export class ServiceStatusComponent implements OnInit {
  trackingCode: string = '';
  serviceResult: ServiceStatus | null = null;
  errorMessage: string = '';

  // Datos simulados (en un caso real, esto vendría de una API)
  mockServices: ServiceStatus[] = [
    {
      trackingCode: 'ST-00123',
      serviceType: 'Mantenimiento de Aires Acondicionados',
      status: 'En Proceso',
      assignedTechnician: 'Carlos Ruiz',
      lastUpdate: '2025-07-12 10:00',
      estimatedCompletion: '2025-07-15',
      notes: 'Esperando pieza de repuesto.'
    },
    {
      trackingCode: 'ST-00456',
      serviceType: 'Reparación de Fuga de Agua',
      status: 'Completado',
      assignedTechnician: 'Ana García',
      lastUpdate: '2025-07-10 16:30',
      estimatedCompletion: '2025-07-10',
      notes: 'Fuga reparada y probada. Cliente satisfecho.'
    },
    {
      trackingCode: 'ST-00789',
      serviceType: 'Instalación Eléctrica',
      status: 'Pendiente',
      lastUpdate: '2025-07-11 09:00',
      estimatedCompletion: '2025-07-18',
      notes: 'Visita programada para levantamiento.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  checkStatus(): void {
    this.serviceResult = null;
    this.errorMessage = '';

    if (!this.trackingCode) {
      this.errorMessage = 'Por favor, ingresa un código de seguimiento.';
      return;
    }

    // Simular la búsqueda en una API
    const foundService = this.mockServices.find(s => s.trackingCode.toLowerCase() === this.trackingCode.toLowerCase());

    if (foundService) {
      this.serviceResult = foundService;
    } else {
      this.errorMessage = 'Código de seguimiento no encontrado. Verifica y vuelve a intentar.';
    }
  }

  getStatusClass(status: ServiceStatus['status']): string {
    switch (status) {
      case 'Completado': return 'status-completed';
      case 'En Proceso': return 'status-in-progress';
      case 'Pendiente': return 'status-pending';
      case 'Cancelado': return 'status-cancelled';
      default: return '';
    }
  }
}