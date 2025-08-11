import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';

interface Client {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
  correo: string | null;
  rfc: string;
  estatus: boolean;  // Booleano para el estado
  fecha_registro: string;
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
  isAdmin = false;

  private apiUrl = 'https://fixflow-backend.onrender.com/api/clientes/';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.clientId = +idParam;
        this.loadClient(this.clientId);
      }
    });

    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  loadClient(id: number): void {
    this.http.get<Client>(`${this.apiUrl}${id}/`).subscribe({
      next: (data) => this.client = data,
      error: (err) => {
        console.error('Error cargando cliente', err);
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
    if (this.clientId) {
      this.http.delete(`${this.apiUrl}${this.clientId}/`).subscribe({
        next: () => {
          console.log('Cliente eliminado correctamente.');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Error eliminando cliente', err);
        }
      });
    }
  }

  toggleClientStatus(): void {
    if (!this.isAdmin || !this.client) return;

    const nuevoEstatus = !this.client.estatus;
    const id = this.client.id;

    // Usar FormData para evitar problemas de Content-Type
    const formData = new FormData();
    formData.append('estatus', nuevoEstatus.toString());

    this.http.patch<Client>(`${this.apiUrl}${id}/`, formData).subscribe({
      next: (updatedClient) => {
        console.log('Estatus actualizado:', updatedClient);
        this.client = updatedClient;
      },
      error: (error) => {
        console.error('Error actualizando estatus:', error);
      }
    });
  }

  // Método auxiliar para mostrar texto en base a estatus booleano
  getStatusText(): string {
    if (!this.client) return '';
    return this.client.estatus ? 'Activo' : 'Inactivo';
  }
}
