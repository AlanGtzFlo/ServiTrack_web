// src/app/clients/clients.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { RouterModule } from '@angular/router'; 
import { HttpClient } from '@angular/common/http'; // Importa HttpClient

interface Client {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
  rfc: string;
  status: 'Activo' | 'Inactivo' | 'Potencial';
  fecha_registro: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  searchTerm: string = '';

  private apiUrl = 'https://fixflow-backend.onrender.com/api/clientes/'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.http.get<Client[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
      }
    });
  }

  get filteredClients(): Client[] {
    if (!this.searchTerm) {
      return this.clients;
    }
    const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
    return this.clients.filter(client =>
      client.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
      (client.direccion?.toLowerCase().includes(lowerCaseSearchTerm) ?? false) ||
      (client.telefono?.toLowerCase().includes(lowerCaseSearchTerm) ?? false) ||
      client.rfc.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
}
