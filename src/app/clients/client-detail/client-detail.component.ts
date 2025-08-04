// src/app/clients/client-detail/client-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Añadir DatePipe aquí
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// CORRECCIÓN FINAL: Usar ruta absoluta para clients-data
import { Client, CLIENTS_DATA } from '../clients-data';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  // Asegurarse de que DatePipe esté en imports si se usa en el template directamente
  imports: [CommonModule, RouterModule, DatePipe], 
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  client: Client | undefined;
  clientId: number | undefined;

  // CORRECCIÓN: Hacer 'router' público para que pueda ser accedido desde el HTML
  constructor(
    private route: ActivatedRoute,
    public router: Router // CAMBIO: de private a public
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.clientId = +idParam; // Convertir a número
        // CORRECCIÓN: Especificar el tipo para 'c' en find
        this.client = CLIENTS_DATA.find((c: Client) => c.id === this.clientId);
        if (!this.client) {
          console.warn(`Cliente con ID ${this.clientId} no encontrado.`);
          // Opcional: redirigir a una página de error o al listado de clientes
          // this.router.navigate(['/clients']);
        }
      }
    });
  }

  editClient(): void {
    if (this.clientId) {
      // Navegar al componente NewClientComponent para edición con el ID en los parámetros
      this.router.navigate(['/clients/new', this.clientId]); // La ruta '/clients/new/:id' se encargará
    }
  }

  deleteClient(): void {
    if (this.clientId && confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      // CORRECCIÓN: Especificar el tipo para 'c' en findIndex
      const index = CLIENTS_DATA.findIndex((c: Client) => c.id === this.clientId);
      if (index > -1) {
        CLIENTS_DATA.splice(index, 1); // Eliminar de los datos simulados
        console.log(`Cliente con ID ${this.clientId} eliminado (simulado).`);
        this.router.navigate(['/clients']); // Redirigir al listado de clientes
      }
    }
  }
}