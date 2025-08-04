// src/app/clients/clients.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { RouterModule } from '@angular/router'; // Importa RouterModule para routerLink

// Interfaz para definir la estructura de un cliente
interface Client {
  id: number;
  name: string;
  address: string;
  contact: string; // Mantengo 'contact' aquí como lo tenías, ajusta si en realidad es 'phone'
  rfc: string;
  // CORRECCIÓN AQUÍ: Cambiar el tipo de status para coincidir con NewClientComponent
  status: 'Activo' | 'Inactivo' | 'Potencial';
  // Añadir la fecha de registro para ser coherentes con el formulario de creación
  registrationDate: string; // YYYY-MM-DD
}

@Component({
  selector: 'app-clients',
  standalone: true, // ¡Importante si usas standalone components!
  imports: [CommonModule, FormsModule, RouterModule], // Asegúrate de importar FormsModule y RouterModule
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  // Datos simulados de clientes (FRONT-END ÚNICAMENTE)
  // CORRECCIÓN AQUÍ: Ajustar los datos para usar los nuevos valores de status y añadir registrationDate
  clients: Client[] = [
    { id: 1, name: 'Transportes El Águila S.A. de C.V.', address: 'Av. Siempre Viva 123, Springfield, USA', contact: '55 1234 5678', rfc: 'TEA920101XYZ', status: 'Activo', registrationDate: '2022-01-15' },
    { id: 2, name: 'Comercializadora del Valle S. de R.L. de C.V.', address: 'Calle Ficticia 45, Col. Centro, Ciudad Ejemplo', contact: '55 9876 5432', rfc: 'CDV950315ABC', status: 'Activo', registrationDate: '2021-06-20' },
    { id: 3, name: 'Constructora Alfa del Sureste S.A.', address: 'Blvd. Imaginario 789, Del. Obrero, Metropolis', contact: '55 2345 6789', rfc: 'CAS980720DEF', status: 'Inactivo', registrationDate: '2020-03-10' },
    { id: 4, name: 'Servicios Integrales Omega S.C.', address: 'Privada Fantasía 101, Cumbres, Villa Sueño', contact: '55 3456 7890', rfc: 'SIO010905GHI', status: 'Activo', registrationDate: '2023-09-01' },
    { id: 5, name: 'Logística Rápida Express', address: 'Via Principal 55, Las Lomas, Pueblito Nuevo', contact: '55 8765 4321', rfc: 'LRE051122JKL', status: 'Potencial', registrationDate: '2024-02-28' }, // Ejemplo de 'Potencial'
  ];
  searchTerm: string = '';

  constructor() { }

  ngOnInit(): void {
    
  }

  get filteredClients(): Client[] {
    if (!this.searchTerm) {
      return this.clients;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    return this.clients.filter(client =>
      client.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.address.toLowerCase().includes(lowerCaseSearchTerm) ||
      client.contact.toLowerCase().includes(lowerCaseSearchTerm) || // Asumo que 'contact' es la propiedad para el teléfono/contacto
      client.rfc.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  // CORRECCIÓN AQUÍ: Eliminar o comentar este método ya que el botón en el HTML usa routerLink
  // addNewClient(): void {
  //   console.log('Action: Abrir formulario o modal para añadir un nuevo cliente.');
  // }
}