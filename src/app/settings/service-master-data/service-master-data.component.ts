// src/app/settings/service-master-data/service-master-data.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service-master-data',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './service-master-data.component.html',
  styleUrls: ['./service-master-data.component.scss'] // Puedes dejar vacío o usar estilos compartidos
})
export class ServiceMasterDataComponent implements OnInit {
  serviceTypes: string[] = ['Correctivo', 'Preventivo', 'Instalación', 'Inspección', 'Auditoría'];
  priorities: string[] = ['Urgente', 'Alta', 'Media', 'Baja'];
  serviceStatuses: string[] = ['Pendiente', 'Asignado', 'En Proceso', 'Concluido', 'Cerrado', 'Cancelado'];

  newServiceType: string = '';
  newPriority: string = '';
  newStatus: string = '';

  constructor() { }

  ngOnInit(): void {
    // Cargar datos maestros desde una API
    console.log('Cargando datos maestros de servicio...');
  }

  addServiceType(): void {
    if (this.newServiceType.trim() && !this.serviceTypes.includes(this.newServiceType.trim())) {
      this.serviceTypes.push(this.newServiceType.trim());
      this.newServiceType = '';
      alert('Tipo de servicio añadido (simulado).');
    } else {
      alert('Tipo de servicio inválido o ya existe.');
    }
  }

  removeServiceType(type: string): void {
    if (confirm(`¿Eliminar tipo de servicio "${type}"? Esto podría afectar servicios existentes.`)) {
      this.serviceTypes = this.serviceTypes.filter(t => t !== type);
      alert('Tipo de servicio eliminado (simulado).');
    }
  }

  addPriority(): void {
    if (this.newPriority.trim() && !this.priorities.includes(this.newPriority.trim())) {
      this.priorities.push(this.newPriority.trim());
      this.newPriority = '';
      alert('Prioridad añadida (simulado).');
    } else {
      alert('Prioridad inválida o ya existe.');
    }
  }

  removePriority(priority: string): void {
    if (confirm(`¿Eliminar prioridad "${priority}"?`)) {
      this.priorities = this.priorities.filter(p => p !== priority);
      alert('Prioridad eliminada (simulado).');
    }
  }

  addStatus(): void {
    if (this.newStatus.trim() && !this.serviceStatuses.includes(this.newStatus.trim())) {
      this.serviceStatuses.push(this.newStatus.trim());
      this.newStatus = '';
      alert('Estado añadido (simulado).');
    } else {
      alert('Estado inválido o ya existe.');
    }
  }

  removeStatus(status: string): void {
    if (confirm(`¿Eliminar estado "${status}"?`)) {
      this.serviceStatuses = this.serviceStatuses.filter(s => s !== status);
      alert('Estado eliminado (simulado).');
    }
  }
}