// src/app/policies/policy-detail/policy-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Interfaz para póliza (consistente con policies.component.ts)
interface Policy {
  id: number;
  policyNumber: string;
  clientName: string;
  clientId: number; // Añadido para poder navegar al detalle del cliente
  type: 'Interna' | 'Externa';
  startDate: string;
  endDate: string;
  status: 'Vigente' | 'Vencida' | 'Pendiente';
  description: string;
  terms: string; // Términos y condiciones
  coveredItems: string[]; // Elementos cubiertos por la póliza
  notes: string;
  assignedAgent: string; // Agente/Responsable asignado
}

// Simulación de documentos adjuntos
interface Document {
  name: string;
  url: string;
  type: 'PDF' | 'DOCX' | 'IMAGE';
}

@Component({
  selector: 'app-policy-detail',
  standalone: true, // ¡Importante si usas standalone components!
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss']
})
export class PolicyDetailComponent implements OnInit {
  policyId: number | null = null;
  policy: Policy | undefined;
  documents: Document[] = [];

  // Datos simulados (FRONT-END ÚNICAMENTE)
  private mockPolicies: Policy[] = [
    {
      id: 101, policyNumber: 'POL-AGUILA-001', clientName: 'Transportes El Águila S.A. de C.V.', clientId: 1, type: 'Externa', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Vigente',
      description: 'Póliza de mantenimiento preventivo anual para la flota de vehículos pesados y equipos de carga en todas las sucursales.',
      terms: 'Cobertura 24/7, incluye repuestos originales, 4 visitas preventivas anuales, atención de emergencias en menos de 24 horas.',
      coveredItems: ['Camiones Clase 8 (x10)', 'Montacargas (x5)', 'Grúas de patio (x2)', 'Sistemas de refrigeración (x8)'],
      notes: 'Requiere revisión trimestral con el gerente de operaciones.',
      assignedAgent: 'Juan Pérez'
    },
    {
      id: 102, policyNumber: 'POL-AGUILA-002', clientName: 'Transportes El Águila S.A. de C.V.', clientId: 1, type: 'Interna', startDate: '2023-07-01', endDate: '2024-06-30', status: 'Vigente',
      description: 'Póliza de soporte y mantenimiento de la infraestructura de TI para sistemas de gestión de rutas y logística.',
      terms: 'Soporte remoto ilimitado, 2 visitas presenciales al mes, actualizaciones de software anuales.',
      coveredItems: ['Servidores de logística', 'Bases de datos de rutas', 'Software de tracking GPS', 'Equipos de red (Routers, Switches)'],
      notes: 'Pendiente de migración a la nueva plataforma de monitoreo en Q3.',
      assignedAgent: 'María López'
    },
    {
      id: 103, policyNumber: 'POL-VALLE-001', clientName: 'Comercializadora del Valle S. de R.L. de C.V.', clientId: 2, type: 'Externa', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Vencida',
      description: 'Póliza de servicios correctivos para equipos de almacén como bandas transportadoras y sistemas de paletizado.',
      terms: 'Atención a fallos en 48 horas hábiles, incluye mano de obra.',
      coveredItems: ['Bandas transportadoras (x3)', 'Paletizadores automáticos (x2)', 'Etiquetadoras industriales (x4)'],
      notes: 'Póliza vencida, cliente interesado en renovación con ampliación de cobertura.',
      assignedAgent: 'Pedro Gómez'
    },
    {
      id: 104, policyNumber: 'POL-OMEGA-001', clientName: 'Servicios Integrales Omega S.C.', clientId: 4, type: 'Interna', startDate: '2024-03-01', endDate: '2025-02-28', status: 'Vigente',
      description: 'Póliza de mantenimiento integral para infraestructura de edificio principal, incluyendo HVAC y sistemas de seguridad.',
      terms: 'Mantenimiento preventivo bimensual, atención a fallos prioritarios 24/7.',
      coveredItems: ['Sistemas HVAC (x15)', 'Cámaras de seguridad (x50)', 'Alarmas (x10)', 'Sistemas de control de acceso (x5)'],
      notes: 'Instalación de nuevos sensores de movimiento en Julio.',
      assignedAgent: 'Laura García'
    },
    {
      id: 106, policyNumber: 'POL-LOGISTICA-001', clientName: 'Logística Rápida Express', clientId: 5, type: 'Interna', startDate: '2024-07-01', endDate: '2025-06-30', status: 'Pendiente',
      description: 'Póliza de inicio de servicios de consultoría para optimización de procesos logísticos y cadena de suministro.',
      terms: 'Diagnóstico inicial, plan de acción, seguimiento mensual durante 6 meses, capacitación al personal clave.',
      coveredItems: ['Optimización de rutas', 'Gestión de inventarios', 'Análisis de cadena de suministro', 'Capacitación en software logístico'],
      notes: 'Primera reunión programada para el 15 de Julio para definir el alcance exacto.',
      assignedAgent: 'Carlos Ruíz'
    }
  ];

  private mockDocuments: Document[] = [
    { name: 'Contrato POL-AGUILA-001.pdf', url: '#', type: 'PDF' },
    { name: 'Anexo Técnico Flota.pdf', url: '#', type: 'PDF' },
    { name: 'Guía de Mantenimiento.docx', url: '#', type: 'DOCX' },
    { name: 'Copia Identificación Agente.jpg', url: '#', type: 'IMAGE' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.policyId = Number(params.get('id'));
      if (this.policyId) {
        this.loadPolicyData(this.policyId);
      } else {
        console.warn('No se proporcionó un ID de póliza.');
        this.router.navigate(['/policies']);
      }
    });
  }

  // FRONT-END ÚNICAMENTE: Simula la carga de datos de la póliza
  private loadPolicyData(id: number): void {
    this.policy = this.mockPolicies.find(p => p.id === id);
    if (this.policy) {
      // Asociar documentos simulados a una póliza específica para demostración
      if (this.policy.id === 101) {
        this.documents = this.mockDocuments;
      } else {
        this.documents = [];
      }
    } else {
      console.error('Póliza no encontrada para el ID:', id);
      this.router.navigate(['/policies']);
    }
  }

  editPolicy(): void {
    console.log('Action: Editar póliza', this.policyId);
  }

  deletePolicy(): void {
    console.log('Action: Eliminar póliza', this.policyId);
    if (confirm(`¿Estás seguro de que quieres eliminar la póliza ${this.policy?.policyNumber}?`)) {
      console.log('Póliza eliminada (simulado)');
      this.router.navigate(['/policies']);
    }
  }

  downloadDocument(docUrl: string): void {
    console.log('Descargando documento:', docUrl);
    // En un proyecto real, aquí se iniciaría una descarga real
    alert('Simulando descarga del documento.');
    // window.open(docUrl, '_blank'); // Abrir en una nueva pestaña
  }

  goToPoliciesList(): void {
    this.router.navigate(['/policies']);
  }

  goToClientDetail(clientId: number): void {
    this.router.navigate(['/clients', clientId]);
  }
}