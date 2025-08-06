import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Client {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
  correo: string | null;
  rfc: string;
  status: 'Activo' | 'Inactivo' | 'Potencial';
  fecha_registro: string; // ISO string (puede usarse para otros fines)
}

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss']
})
export class ClientDetailComponent implements OnInit {
  client: Client | undefined;
  clientId: number | undefined;

  private apiUrl = 'http://18.222.150.133/api/clientes/'; // URL real de la API

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.clientId = +idParam;
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.http.get<Client>(`${this.apiUrl}${id}/`).subscribe({
      next: (data) => this.client = data,
      error: (err) => {
        console.error('Error cargando cliente', err);
        alert('No se pudo cargar la información del cliente.');
        this.router.navigate(['/clients']);
      }
    });
  }

  editClient(): void {
    if (this.clientId) {
      this.router.navigate(['/clients/edit', this.clientId]);
    }
  }

  deleteClient(): void {
    if (this.clientId && confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.http.delete(`${this.apiUrl}${this.clientId}/`).subscribe({
        next: () => {
          alert('Cliente eliminado correctamente.');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Error eliminando cliente', err);
          alert('No se pudo eliminar el cliente.');
        }
      });
    }
  }
}
