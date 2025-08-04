import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Usamos la misma interfaz Policy que en policies.component.ts y policy-detail.component.ts
interface Policy {
  id: number;
  policyNumber: string;
    // Para mostrar en el formulario
  policyType: string;
  coverage: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'Activa' | 'Expirada' | 'Cancelada' | 'Pendiente';
  renewalDate?: string; // YYYY-MM-DD
}

// Interfaz simplificada para clientes (solo para el selector)
interface ClientLookup {
  id: number;
  name: string;
}

@Component({
  selector: 'app-new-policy',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-policy.component.html',
  styleUrls: ['./new-policy.component.scss']
})
export class NewPolicyComponent implements OnInit {
  newPolicy: Policy = {
    id: 0,
    policyNumber: '',
    // Se llenará al seleccionar el cliente
    policyType: 'Mantenimiento General', // Tipo por defecto
    coverage: 'Básico',
    startDate: new Date().toISOString().split('T')[0],
    endDate: this.getOneYearLaterDate(), // Un año después por defecto
    status: 'Pendiente', // Estado por defecto
  };

  // Datos simulados para los selectores
  policyTypes = ['Mantenimiento General', 'Garantía Extendida', 'Soporte 24/7', 'Instalación Premium'];
  coverages = ['Básico', 'Estándar', 'Completo'];
  statuses = ['Activa', 'Expirada', 'Cancelada', 'Pendiente'];
  
  // Lista simulada de clientes para el selector
  clients: ClientLookup[] = [
    { id: 1, name: 'Tech Solutions S.A. de C.V.' },
    { id: 2, name: 'Global Logistics S.R.L.' },
    { id: 3, name: 'Innovatech Corp.' },
    { id: 4, name: 'Pyme Digital' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // En un escenario real, aquí cargarías la lista de clientes desde una API.
  }

  /**
   * Simula el guardado de una nueva póliza.
   * En un escenario real, se enviaría este objeto a un servicio para que lo guarde en la base de datos.
   */
  saveNewPolicy(): void {
    // Aquí puedes agregar validación adicional antes de guardar
    if (!this.newPolicy.policyType || !this.newPolicy.startDate || !this.newPolicy.endDate || !this.newPolicy.status) {
      console.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    
    // Simular la asignación de un ID y un número de póliza generados por el backend
    this.newPolicy.id = Math.floor(Math.random() * 1000) + 5; // ID aleatorio para simulación
    this.newPolicy.policyNumber = `POL-${new Date().getTime()}`; // Número de póliza simulado

    console.log('Guardando la nueva póliza:', this.newPolicy);
    
    // Aquí se llamaría a un servicio, por ejemplo:
    // this.policyService.savePolicy(this.newPolicy).subscribe(() => {
    //   console.log('Póliza guardada con éxito.');
    //   this.router.navigate(['/policies']);
    // });

    // Para esta simulación, simplemente redirigimos después de un pequeño retraso
    setTimeout(() => {
      alert('Póliza guardada con éxito.'); // Usar una alerta para la simulación
      this.router.navigate(['/policies']); // Redirigir al listado de pólizas
    }, 500);
  }
  
  /**
   * Redirige al usuario de vuelta al listado de pólizas sin guardar cambios.
   */
  cancel(): void {
    console.log('Operación cancelada. Regresando a la lista de pólizas.');
    this.router.navigate(['/policies']);
  }

  // Función auxiliar para calcular la fecha de finalización
  private getOneYearLaterDate(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1);
    return today.toISOString().split('T')[0];
  }

}
