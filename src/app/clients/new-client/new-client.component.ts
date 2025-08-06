// src/app/clients/new-client/new-client.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Interfaz que representa el formato recibido de la API
interface ApiClient {
  id?: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
  is_active: boolean; // Propiedad que viene de la API
  fecha_registro?: string;
}

// Interfaz interna usada en la app
interface Client {
  id?: number;
  nombre: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
  status: 'Activo' | 'Inactivo' | 'Potencial';
  fecha_registro?: string;
}

@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  client: Client = {
    nombre: '',
    correo: '',
    telefono: null,
    direccion: null,
    status: 'Activo'
  };
  isEditing = false;
  clientId: number | null = null;

  private apiUrl = 'http://18.222.150.133/api/clientes/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.isEditing = true;
        this.clientId = +idParam;
        this.loadClient(this.clientId);
      } else {
        this.isEditing = false;
      }
    });
  }

  loadClient(id: number): void {
    this.http.get<ApiClient>(`${this.apiUrl}${id}/`).subscribe({
      next: (data) => {
        // Convertir ApiClient a Client interno
        this.client = {
          nombre: data.nombre,
          correo: data.correo,
          telefono: data.telefono,
          direccion: data.direccion,
          status: data.is_active ? 'Activo' : 'Inactivo',
          fecha_registro: data.fecha_registro
        };
      },
      error: (err) => {
        console.error('Error cargando cliente', err);
        alert('No se pudo cargar la información del cliente.');
        this.router.navigate(['/clients']);
      }
    });
  }

  saveClient(): void {
    const payload = {
      nombre: this.client.nombre,
      correo: this.client.correo,
      telefono: this.client.telefono,
      direccion: this.client.direccion,
      is_active: this.client.status === 'Activo'
    };

    if (this.isEditing && this.clientId) {
      this.http.put(`${this.apiUrl}${this.clientId}/`, payload).subscribe({
        next: () => {
          alert('Cliente actualizado correctamente.');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Error actualizando cliente', err);
          alert('No se pudo actualizar el cliente.');
        }
      });
    } else {
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          alert('Cliente creado correctamente.');
          this.router.navigate(['/clients']);
        },
        error: (err) => {
          console.error('Error creando cliente', err);
          alert('No se pudo crear el cliente.');
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/clients']);
  }
}
