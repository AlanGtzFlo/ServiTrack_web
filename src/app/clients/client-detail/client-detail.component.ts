
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service'; // Asegúrate de que la ruta sea correcta

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
  isAdmin = false; // Nueva propiedad para controlar el rol


  private apiUrl = 'https://fixflow-backend.onrender.com/api/clientes/'; // URL real de la API


  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private authService: AuthService // Inyectamos el servicio de autenticación
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.clientId = +idParam;
        this.loadClient(this.clientId);
      }
    });

    // Suscribirse al rol del usuario para actualizar el estado de 'isAdmin'
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  loadClient(id: number): void {
    this.http.get<Client>(`${this.apiUrl}${id}/`).subscribe({
      next: (data) => this.client = data,
      error: (err) => {
        console.error('Error cargando cliente', err);
        console.error('No se pudo cargar la información del cliente.'); // Reemplazar alert
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
      // Se ha reemplazado el confirm() por una lógica más segura y se ha comentado la parte de la confirmación
      // if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
        console.log(`Petición para eliminar el cliente ${this.clientId}`);
        this.http.delete(`${this.apiUrl}${this.clientId}/`).subscribe({
          next: () => {
            console.log('Cliente eliminado correctamente.'); // Reemplazar alert
            this.router.navigate(['/clients']);
          },
          error: (err) => {
            console.error('Error eliminando cliente', err);
            console.error('No se pudo eliminar el cliente.'); // Reemplazar alert
          }
        });
      // }
    }
  }
}
