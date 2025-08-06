// src/app/services/service-detail/service-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Para el campo de notas

// Interfaces (consistentes con services.component.ts)
interface Service {
  id: number;
  title: string;
  description: string;
  clientName: string;
  clientId: number;
  policyNumber?: string;
  policyId?: number;
  type: 'Correctivo' | 'Preventivo' | 'Instalación' | 'Inspección';
  priority: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  status: 'Pendiente' | 'Asignado' | 'En Proceso' | 'Concluido' | 'Cerrado' | 'Cancelado';
  reportedDate: string;
  assignedTechnician?: string;
  dueDate?: string;
  location?: string; // Ubicación específica del servicio
  contactPerson?: string; // Persona de contacto en el cliente
  contactPhone?: string;
  notes?: string; // Notas internas del servicio
  resolutionDetails?: string; // Detalles de la resolución
  resolutionDate?: string; // Fecha de resolución
}

// Simulación de un historial de actualizaciones
interface HistoryEntry {
  timestamp: string; // YYYY-MM-DD HH:MM
  user: string;
  action: string;
  details?: string;
}

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Importa FormsModule
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {
  serviceId: number | null = null;
  service: Service | undefined;
  newNote: string = ''; // Para el campo de añadir nota
  history: HistoryEntry[] = []; // Historial de actualizaciones

  private mockServices: Service[] = [
    {
      id: 1, title: 'Fuga en sistema de riego', description: 'Reportada fuga de agua en el sistema de riego del jardín principal de la planta B. Necesita ser reparado urgentemente.',
      clientName: 'Transportes El Águila S.A. de C.V.', clientId: 1, type: 'Correctivo', priority: 'Alta', status: 'Pendiente', reportedDate: '2024-06-28',
      location: 'Planta B, Jardín Principal', contactPerson: 'Luis Morales', contactPhone: '5511223344',
      notes: 'El cliente reporta que la fuga es considerable. Urge atender para evitar inundación.'
    },
    {
      id: 2, title: 'Mantenimiento de aire acondicionado', description: 'Mantenimiento preventivo anual de las 5 unidades de A/C ubicadas en la oficina central. Incluye limpieza de filtros y revisión de gas.',
      clientName: 'Transportes El Águila S.A. de C.V.', clientId: 1, policyNumber: 'POL-AGUILA-001', policyId: 101, type: 'Preventivo', priority: 'Media', status: 'En Proceso', reportedDate: '2024-06-25', assignedTechnician: 'Carlos Ruiz', dueDate: '2024-07-05',
      location: 'Oficina Central, 2do Piso', contactPerson: 'Ana Torres', contactPhone: '5556789012',
      notes: 'Se coordinó visita con Ana Torres para el 2 de Julio a las 10:00 AM.',
      resolutionDetails: 'Se realizó limpieza de filtros y recarga de gas en 3 de 5 unidades. 2 unidades no requerían recarga. Se verificó el correcto funcionamiento. Próximo mantenimiento en un año.',
      resolutionDate: '2024-07-01'
    },
    {
      id: 3, title: 'Instalación de nueva luminaria', description: 'Instalar 5 nuevas luminarias LED en el almacén de productos terminados, sección A-5. El material ya está en sitio.',
      clientName: 'Comercializadora del Valle S. de R.L. de C.V.', clientId: 2, type: 'Instalación', priority: 'Media', status: 'Asignado', reportedDate: '2024-06-20', assignedTechnician: 'Ana García', dueDate: '2024-07-01',
      location: 'Almacén, Sección A-5', contactPerson: 'Roberto Castro', contactPhone: '5577889900',
      notes: 'Ana García confirmará fecha de instalación con Roberto.'
    },
    {
      id: 4, title: 'Inspección de seguridad en bodegas', description: 'Revisión y certificación anual de sistemas de seguridad y alarmas contra incendios en todas las bodegas.',
      clientName: 'Servicios Integrales Omega S.C.', clientId: 4, policyNumber: 'POL-OMEGA-001', policyId: 104, type: 'Inspección', priority: 'Baja', status: 'Concluido', reportedDate: '2024-06-10', assignedTechnician: 'Juan Pérez',
      location: 'Bodegas 1, 2 y 3', contactPerson: 'Martín Soto', contactPhone: '5533221100',
      notes: 'Inspección realizada sin incidentes. Todos los sistemas funcionan correctamente. Se emitió certificado.',
      resolutionDetails: 'Se verificaron 25 sensores de movimiento, 10 cámaras CCTV, sistema de alarma contra incendios y 3 accesos biométricos. Todo operativo y dentro de norma.',
      resolutionDate: '2024-06-12'
    },
    {
      id: 5, title: 'Reparación de elevador de carga', description: 'El elevador de carga principal del edificio 3 presenta un ruido anormal al subir y bajar, además de movimientos erráticos. Se requiere atención inmediata.',
      clientName: 'Constructora Alfa del Sureste S.A.', clientId: 3, type: 'Correctivo', priority: 'Urgente', status: 'Cerrado', reportedDate: '2024-06-05', assignedTechnician: 'Miguel Soto',
      location: 'Edificio 3, Elevador Principal', contactPerson: 'Fernando Díaz', contactPhone: '5500998877',
      notes: 'Cliente muy molesto, requiere solución rápida.',
      resolutionDetails: 'Se identificó y reemplazó rodamiento defectuoso del motor. Se realizó ajuste de contrapesos y lubricación general. Elevador funcionando correctamente. Pruebas de carga OK.',
      resolutionDate: '2024-06-06'
    }
  ];

  private mockHistory: HistoryEntry[] = [
    { timestamp: '2024-06-28 10:00', user: 'Sistema', action: 'Servicio creado' },
    { timestamp: '2024-06-28 10:15', user: 'Admin Global', action: 'Prioridad cambiada a Alta' },
    { timestamp: '2024-06-28 11:00', user: 'Admin Global', action: 'Técnico asignado', details: 'Carlos Ruiz' },
    { timestamp: '2024-06-28 11:05', user: 'Carlos Ruiz', action: 'Estado cambiado a En Proceso' },
    { timestamp: '2024-06-29 14:30', user: 'Carlos Ruiz', action: 'Añadió nota', details: 'Se contactó al cliente para coordinar acceso. Programado para mañana 9 AM.' },
    { timestamp: '2024-07-01 16:00', user: 'Carlos Ruiz', action: 'Estado cambiado a Concluido' },
    { timestamp: '2024-07-01 16:05', user: 'Carlos Ruiz', action: 'Resolución detallada', details: 'Se encontró y reparó la fuga en la tubería principal. Pruebas de presión realizadas, sin fugas.' },
    { timestamp: '2024-07-01 17:00', user: 'Supervisor', action: 'Estado cambiado a Cerrado' }
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.serviceId = Number(params.get('id'));
      if (this.serviceId) {
        this.loadServiceData(this.serviceId);
      } else {
        console.warn('No se proporcionó un ID de servicio.');
        this.router.navigate(['/services']);
      }
    });
  }

  private loadServiceData(id: number): void {
    this.service = this.mockServices.find(s => s.id === id);
    if (this.service) {
      // Simular historial para un servicio específico
      if (this.service.id === 2) { // Ejemplo para el servicio de AC
        this.history = [
          { timestamp: '2024-06-25 09:00', user: 'Sistema', action: 'Servicio creado' },
          { timestamp: '2024-06-25 09:30', user: 'Admin Global', action: 'Técnico asignado', details: 'Carlos Ruiz' },
          { timestamp: '2024-06-25 09:35', user: 'Admin Global', action: 'Fecha límite establecida', details: '2024-07-05' },
          { timestamp: '2024-06-26 14:00', user: 'Carlos Ruiz', action: 'Estado cambiado a En Proceso' },
          { timestamp: '2024-07-01 16:00', user: 'Carlos Ruiz', action: 'Añadió nota', details: 'Mantenimiento completado. Detalles en la resolución.' },
          { timestamp: '2024-07-01 16:30', user: 'Carlos Ruiz', action: 'Estado cambiado a Concluido' }
        ];
      } else if (this.service.id === 5) { // Ejemplo para el elevador
        this.history = [
          { timestamp: '2024-06-05 08:00', user: 'Cliente', action: 'Servicio reportado vía telefónica' },
          { timestamp: '2024-06-05 08:15', user: 'Atención a Cliente', action: 'Servicio creado' },
          { timestamp: '2024-06-05 08:20', user: 'Atención a Cliente', action: 'Prioridad cambiada a Urgente' },
          { timestamp: '2024-06-05 09:00', user: 'Supervisor', action: 'Técnico asignado', details: 'Miguel Soto' },
          { timestamp: '2024-06-05 10:00', user: 'Miguel Soto', action: 'Estado cambiado a En Proceso' },
          { timestamp: '2024-06-06 14:00', user: 'Miguel Soto', action: 'Estado cambiado a Concluido' },
          { timestamp: '2024-06-06 14:10', user: 'Miguel Soto', action: 'Resolución detallada', details: 'Reemplazo de rodamiento defectuoso. Pruebas exitosas.' },
          { timestamp: '2024-06-06 15:00', user: 'Supervisor', action: 'Estado cambiado a Cerrado' }
        ];
      } else {
        this.history = [{ timestamp: '2024-06-01 00:00', user: 'Sistema', action: 'Servicio creado' }]; // Historial básico por defecto
      }

      // Ordenar historial del más reciente al más antiguo
      this.history.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    } else {
      console.error('Servicio no encontrado para el ID:', id);
      this.router.navigate(['/services']);
    }
  }

  goToServicesList(): void {
    this.router.navigate(['/services']);
  }

  goToClientDetail(clientId: number): void {
    this.router.navigate(['/clients', clientId]);
  }

  goToPolicyDetail(policyId: number): void {
    this.router.navigate(['/policies', policyId]);
  }

  getStatusClass(status: Service['status']): string {
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

  saveNote(): void {
    if (this.newNote.trim()) {
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      this.history.unshift({ // Añadir al principio para que sea el más reciente
        timestamp: timestamp,
        user: 'Usuario Actual', // En un caso real, sería el nombre del usuario logueado
        action: 'Añadió nota',
        details: this.newNote.trim()
      });
      // Aquí enviarías la nota a tu backend
      console.log('Guardando nueva nota:', this.newNote);
      this.newNote = ''; // Limpiar el campo
    }
  }

  updateServiceStatus(newStatus: Service['status']): void {
    if (this.service) {
      const oldStatus = this.service.status;
      this.service.status = newStatus;
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      this.history.unshift({
        timestamp: timestamp,
        user: 'Usuario Actual',
        action: 'Estado cambiado',
        details: `De "${oldStatus}" a "${newStatus}"`
      });
      console.log(`Estado de servicio ${this.service.id} actualizado a: ${newStatus}`);
      // Aquí enviarías la actualización al backend
    }
  }

  // Métodos para las acciones de botones (simulados)
  assignTechnician(): void {
    alert('Simulando asignación de técnico (abrir modal de selección).');
    console.log('Abrir selector de técnico.');
  }

  startService(): void {
    this.updateServiceStatus('En Proceso');
    alert('Servicio puesto En Proceso.');
  }

  resolveService(): void {
    alert('Simulando resolución de servicio (abrir modal para detalles de resolución).');
    console.log('Abrir formulario de resolución.');
    this.updateServiceStatus('Concluido'); // O se actualiza después del formulario
  }

  closeService(): void {
    if (this.service?.status === 'Concluido') {
      this.updateServiceStatus('Cerrado');
      alert('Servicio Cerrado.');
    } else {
      alert('El servicio debe estar "Concluido" para poder cerrarlo.');
    }
  }

  cancelService(): void {
    if (confirm('¿Estás seguro de que quieres cancelar este servicio?')) {
      this.updateServiceStatus('Cancelado');
      alert('Servicio Cancelado.');
    }
  }
}