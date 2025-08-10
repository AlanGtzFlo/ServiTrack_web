// src/app/policies/policies.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router'; // ← AÑADIDO: Router

interface Policy {
  id: number;
  policyNumber: string;
  clientName: string;
  type: 'Interna' | 'Externa';
  startDate: string;
  endDate: string;
  status: 'Vigente' | 'Vencida' | 'Pendiente';
  description: string;
}

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {

  policies: Policy[] = [
    { id: 101, policyNumber: 'POL-AGUILA-001', clientName: 'Transportes El Águila S.A. de C.V.', type: 'Externa', startDate: '2024-01-01', endDate: '2024-12-31', status: 'Vigente', description: 'Póliza de mantenimiento preventivo anual para flota de camiones.' },
    { id: 102, policyNumber: 'POL-AGUILA-002', clientName: 'Transportes El Águila S.A. de C.V.', type: 'Interna', startDate: '2023-07-01', endDate: '2024-06-30', status: 'Vigente', description: 'Póliza de soporte técnico de sistemas de monitoreo.' },
    { id: 103, policyNumber: 'POL-VALLE-001', clientName: 'Comercializadora del Valle S. de R.L. de C.V.', type: 'Externa', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Vencida', description: 'Póliza de servicios correctivos para equipos de almacén.' },
    { id: 104, policyNumber: 'POL-OMEGA-001', clientName: 'Servicios Integrales Omega S.C.', type: 'Interna', startDate: '2024-03-01', endDate: '2025-02-28', status: 'Vigente', description: 'Póliza de mantenimiento integral de infraestructura.' },
    { id: 105, policyNumber: 'POL-ALFA-001', clientName: 'Constructora Alfa del Sureste S.A.', type: 'Externa', startDate: '2022-09-01', endDate: '2023-08-31', status: 'Vencida', description: 'Póliza de garantía de obra civil.' },
    { id: 106, policyNumber: 'POL-LOGISTICA-001', clientName: 'Logística Rápida Express', type: 'Interna', startDate: '2024-07-01', endDate: '2025-06-30', status: 'Pendiente', description: 'Póliza de inicio de servicios de consultoría.' },
  ];

  searchTerm: string = '';
  filterStatus: 'all' | 'Vigente' | 'Vencida' | 'Pendiente' = 'all';

  constructor(private router: Router) {} // ← AÑADIDO: inyección del Router

  ngOnInit(): void {
    // Aquí podrías cargar datos desde un servicio en un futuro
  }

  get filteredPolicies(): Policy[] {
    let result = this.policies;

    if (this.searchTerm) {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      result = result.filter(policy =>
        policy.policyNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
        policy.clientName.toLowerCase().includes(lowerCaseSearchTerm) ||
        policy.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (this.filterStatus !== 'all') {
      result = result.filter(policy => policy.status === this.filterStatus);
    }

    return result;
  }

  addNewPolicy(): void {
    console.log('Action: Abrir formulario o modal para añadir una nueva póliza.');
    this.router.navigate(['/policies/new']);
  }
}
