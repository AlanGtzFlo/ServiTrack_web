// src/app/services/new-service/new-service.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Interfaces simplificadas para lookups
interface ClientLookup {
  id: number;
  name: string;
}
interface TechnicianLookup {
  id: number;
  name: string;
}
interface PolicyLookup {
  id: number;
  policyNumber: string;
}

// Usamos la misma interfaz Service que en services.component.ts y service-detail.component.ts
interface Service {
  id: number;
  title: string;
  description: string;
  clientId: number;
  clientName?: string; // Para mostrar en el formulario
  policyId?: number;
  policyNumber?: string; // Para mostrar en el formulario
  assignedToId?: number;
  assignedToName?: string; // Para mostrar en el formulario
  status: 'Pendiente' | 'Asignado' | 'En Proceso' | 'Concluido' | 'Cerrado' | 'Cancelado';
  priority: 'Urgente' | 'Alta' | 'Media' | 'Baja';
  serviceType: string;
  startDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  completionDate?: string; // YYYY-MM-DD
  notes?: string;
}

@Component({
  selector: 'app-new-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {
  newService: Service = {
    id: 0,
    title: '',
    description: '',
    clientId: 0,
    policyId: undefined,
    assignedToId: undefined,
    status: 'Pendiente', // Estado por defecto
    priority: 'Media', // Prioridad por defecto
    serviceType: 'Correctivo', // Tipo por defecto
    startDate: new Date().toISOString().split('T')[0],
    dueDate: this.getOneWeekLaterDate()
  };

  // Datos simulados para los selectores
  clients: ClientLookup[] = [
    { id: 1, name: 'Tech Solutions S.A. de C.V.' },
    { id: 2, name: 'Global Logistics S.R.L.' },
    { id: 3, name: 'Innovatech Corp.' }
  ];
  technicians: TechnicianLookup[] = [
    { id: 101, name: 'Carlos Ruiz' },
    { id: 102, name: 'Ana García' },
    { id: 103, name: 'Miguel Soto' }
  ];
  policies: PolicyLookup[] = [ // Políticas simuladas que "pertenecen" a clientes (simplificado)
    { id: 1001, policyNumber: 'POL-1001 (Tech Solutions)' },
    { id: 1002, policyNumber: 'POL-1002 (Global Logistics)' },
    { id: 1003, policyNumber: 'POL-1003 (Tech Solutions)' }
  ];

  serviceTypes = ['Correctivo', 'Preventivo', 'Instalación', 'Inspección', 'Auditoría'];
  priorities = ['Urgente', 'Alta', 'Media', 'Baja'];
  statuses = ['Pendiente', 'Asignado', 'En Proceso', 'Concluido', 'Cerrado', 'Cancelado'];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Cargar datos reales de clientes, técnicos, pólizas si fuera un backend.
  }

  private getOneWeekLaterDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toISOString().split('T')[0];
  }

  onClientSelected(): void {
    const selectedClient = this.clients.find(c => c.id === this.newService.clientId);
    this.newService.clientName = selectedClient ? selectedClient.name : '';
    // En un caso real, aquí filtrarías las pólizas por el cliente seleccionado
    // y podrías limpiar el policyId si la política actual no pertenece a este cliente.
  }

  onTechnicianSelected(): void {
    const selectedTechnician = this.technicians.find(t => t.id === this.newService.assignedToId);
    this.newService.assignedToName = selectedTechnician ? selectedTechnician.name : '';
  }

  onPolicySelected(): void {
    const selectedPolicy = this.policies.find(p => p.id === this.newService.policyId);
    this.newService.policyNumber = selectedPolicy ? selectedPolicy.policyNumber : '';
  }

  saveNewService(): void {
    // FRONT-END ÚNICAMENTE: Simula la adición de un nuevo servicio
    if (!this.newService.clientId || !this.newService.title || !this.newService.description) {
      alert('Por favor, completa los campos obligatorios: Cliente, Título y Descripción.');
      return;
    }
    console.log('Guardando nuevo servicio:', this.newService);

    // Simulación de asignación de ID y redirección
    this.newService.id = Math.floor(Math.random() * 1000) + 200; // ID aleatorio simulado
    alert(`Servicio "${this.newService.title}" (#${this.newService.id}) añadido con éxito (simulado).`);

    this.router.navigate(['/services', this.newService.id]);
  }

  cancel(): void {
    this.router.navigate(['/services']);
  }
}