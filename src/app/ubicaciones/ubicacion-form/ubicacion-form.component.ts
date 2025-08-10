// src/app/ubicaciones/ubicacion-form/ubicacion-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para la estructura de tu API de Clientes
export interface Cliente {
  id: number;
  nombre: string;
}

// Interfaz para la estructura de tu API de Empresas
export interface Empresa {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-ubicacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './ubicacion-form.component.html',
  styleUrls: ['./ubicacion-form.component.scss']
})
export class UbicacionFormComponent implements OnInit {
  // Modelo de datos para el formulario de ubicación
  ubicacion: any = {
    nombre: '',
    direccion: '',
    clienteId: null,
    empresaId: null,
    contacto: '',
    estatus: false
  };

  // Datos para los selectores (dropdowns)
  clientes: Cliente[] = [];
  empresas: Empresa[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  
  private ubicacionesApiUrl = 'https://fixflow-backend.onrender.com/api/ubicaciones/';
  private clientesApiUrl = 'https://fixflow-backend.onrender.com/api/clientes/';
  private empresasApiUrl = 'https://fixflow-backend.onrender.com/api/empresas/';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Carga los clientes y empresas de la API
    this.isLoading = true;
    this.errorMessage = null;

    forkJoin({
      clientes: this.http.get<Cliente[]>(this.clientesApiUrl).pipe(
        catchError(error => {
          console.error('Error al obtener clientes:', error);
          this.errorMessage = 'No se pudieron cargar los clientes.';
          return of([]);
        })
      ),
      empresas: this.http.get<Empresa[]>(this.empresasApiUrl).pipe(
        catchError(error => {
          console.error('Error al obtener empresas:', error);
          this.errorMessage = 'No se pudieron cargar las empresas.';
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        this.clientes = data.clientes;
        this.empresas = data.empresas;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos iniciales:', error);
        this.errorMessage = 'Ocurrió un error al cargar los datos del formulario.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.ubicacion.nombre && this.ubicacion.direccion && this.ubicacion.clienteId && this.ubicacion.empresaId) {
      // Prepara los datos para la solicitud POST, usando los IDs
      const newUbicacion = {
        nombre: this.ubicacion.nombre,
        direccion: this.ubicacion.direccion,
        cliente_id: this.ubicacion.clienteId, // Usa cliente_id como lo espera el backend
        empresa_id: this.ubicacion.empresaId, // Usa empresa_id como lo espera el backend
        contacto: this.ubicacion.contacto,
        estatus: this.ubicacion.estatus,
      };

      this.http.post<any>(this.ubicacionesApiUrl, newUbicacion).subscribe({
        next: (response) => {
          console.log('Ubicación creada con éxito:', response);
          // Redirige a la lista de ubicaciones después de guardar
          this.router.navigate(['/ubicaciones']);
        },
        error: (error) => {
          console.error('Error al crear la ubicación:', error);
          this.errorMessage = 'No se pudo crear la ubicación. Verifique los datos e intente de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
    }
  }

  goBack(): void {
    this.router.navigate(['/ubicaciones']);
  }
}
