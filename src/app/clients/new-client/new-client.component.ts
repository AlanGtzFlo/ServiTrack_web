// src/app/clients/new-client/new-client.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Asegúrate de tener DatePipe si lo usas en el template
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { ActivatedRoute, Router } from '@angular/router'; // Para rutas y navegación
// CORRECCIÓN FINAL: Usar ruta absoluta para clients-data
import { Client, CLIENTS_DATA, Contact } from '../clients-data';

@Component({
  selector: 'app-new-client',
  standalone: true,
  // Asegúrate de que DatePipe esté en imports si se usa en el template directamente
  imports: [CommonModule, FormsModule, DatePipe], 
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  client: Client = { // Inicializar un cliente vacío para el formulario
    id: 0, // Se asignará un ID al guardar si es nuevo
    name: '',
    rfc: '',
    address: '',
    contact: {
      email: '',
      phone: ''
    },
    status: 'Activo', // Estado por defecto
    registrationDate: new Date() // Fecha de registro por defecto
  };
  isEditing: boolean = false;
  originalClientId: number | undefined; // Para mantener el ID original si se edita

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditing = true;
        this.originalClientId = +idParam;
        // CORRECCIÓN: Especificar el tipo para 'c' en find
        const foundClient = CLIENTS_DATA.find((c: Client) => c.id === this.originalClientId);
        if (foundClient) {
          // Clonar el objeto para evitar modificar el original directamente antes de guardar
          // y clonar también el objeto 'contact' para evitar problemas de referencia
          this.client = { ...foundClient, contact: { ...foundClient.contact } };
        } else {
          console.warn(`Cliente con ID ${this.originalClientId} no encontrado para edición.`);
          this.router.navigate(['/clients/new']); // Si no se encuentra, ir a crear nuevo
        }
      } else {
        this.isEditing = false;
        // Reiniciar el cliente para un nuevo formulario si no hay ID
        this.client = {
          id: 0,
          name: '',
          rfc: '',
          address: '',
          contact: { email: '', phone: '' },
          status: 'Activo',
          registrationDate: new Date()
        };
      }
    });
  }

  saveClient(): void {
    if (this.isEditing) {
      // Lógica para editar cliente existente
      // CORRECCIÓN: Especificar el tipo para 'c' en findIndex
      const index = CLIENTS_DATA.findIndex((c: Client) => c.id === this.originalClientId);
      if (index > -1) {
        // Actualizar el cliente en la lista simulada
        CLIENTS_DATA[index] = this.client;
        console.log('Cliente actualizado (simulado):', this.client);
      }
    } else {
      // Lógica para crear nuevo cliente
      // Asignar un nuevo ID (simulado, el más alto + 1)
      // CORRECCIÓN: Especificar el tipo para 'c' en map
      const newId = CLIENTS_DATA.length > 0 ? Math.max(...CLIENTS_DATA.map((c: Client) => c.id)) + 1 : 1;
      this.client.id = newId;
      this.client.registrationDate = new Date(); // Asegurar la fecha de registro al crear
      CLIENTS_DATA.push(this.client); // Añadir a la lista simulada
      console.log('Nuevo cliente creado (simulado):', this.client);
    }
    this.router.navigate(['/clients']); // Redirigir al listado de clientes
  }

  cancel(): void {
    this.router.navigate(['/clients']); // Volver al listado sin guardar
  }
}