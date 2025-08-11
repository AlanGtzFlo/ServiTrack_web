import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service'; // Importa el AuthService

// Interfaz para la estructura del cliente
interface Client {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
  rfc: string;
  estatus: boolean;
  fecha_registro: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];
  searchTerm: string = '';
  filterStatus: 'all' | true | false = 'all';
  isLoading = false;
  isAdmin: boolean = false; // Nueva variable para controlar la visibilidad de los botones

  private apiUrl = 'https://fixflow-backend.onrender.com/api/clientes/';
  // URL para exportar el PDF
  private exportPdfUrl = 'https://fixflow-backend.onrender.com/api/clientes/exportar_pdf/';

  constructor(private router: Router, private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    // Suscribirse al rol del usuario para determinar los permisos
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = (role === 'admin');
    });
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.http.get<Client[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.clients = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.isLoading = false;
      }
    });
  }

  get filteredClients(): Client[] {
    let result = this.clients;

    if (this.searchTerm) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(client =>
        client.nombre.toLowerCase().includes(lowerTerm) ||
        client.direccion.toLowerCase().includes(lowerTerm) ||
        client.rfc.toLowerCase().includes(lowerTerm)
      );
    }

    if (this.filterStatus !== 'all') {
      result = result.filter(client => client.estatus === this.filterStatus);
    }

    return result;
  }

  // Método para obtener la clase CSS del estatus del cliente
  getStatusClass(estatus: boolean): string {
    return estatus ? 'status-success' : 'status-error';
  }

  // Método para obtener el texto del estatus del cliente
  getStatusText(estatus: boolean): string {
    return estatus ? 'Activo' : 'Inactivo';
  }

  addNewClient(): void {
    this.router.navigate(['/clients/new']);
  }

  // Nuevo método para exportar el PDF
  exportPdf(): void {
    this.isLoading = true; // Opcional: mostrar un indicador de carga
    this.http.get(this.exportPdfUrl, { responseType: 'blob' }).subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'clientes.pdf';
        link.click();
        URL.revokeObjectURL(fileURL);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al exportar PDF:', err);
        this.isLoading = false;
      }
    });
  }
}
