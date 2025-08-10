// src/app/ubicaciones/ubicaciones-list/ubicaciones-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

// Interfaz para la estructura de tu API de Clientes
export interface Cliente {
  id: number | null;
  nombre: string;
}

// Interfaz para la estructura de tu API de Empresas
export interface Empresa {
  id: number | null;
  nombre: string;
}

// Interfaz para la estructura de las ubicaciones combinadas
export interface Ubicacion {
  id: number;
  nombre: string;
  direccion: string;
  cliente: Cliente;
  empresa: Empresa;
  contacto: string;
  estatus: boolean;
}

@Component({
  selector: 'app-ubicaciones-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule // Añade FormsModule para que [(ngModel)] funcione
  ],
  templateUrl: './ubicaciones-list.component.html',
  styleUrls: ['./ubicaciones-list.component.scss']
})
export class UbicacionesListComponent implements OnInit {
  private ubicacionesApiUrl = 'https://fixflow-backend.onrender.com/api/ubicaciones/';
  private clientesApiUrl = 'https://fixflow-backend.onrender.com/api/clientes/';
  private empresasApiUrl = 'https://fixflow-backend.onrender.com/api/empresas/';
  private exportPdfUrl = 'https://fixflow-backend.onrender.com/api/usuarios/exportar_ubicaciones/';
  
  ubicaciones: Ubicacion[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm: string = ''; // Nueva propiedad para el término de búsqueda

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.error = null;

    forkJoin({
      ubicaciones: this.http.get<any[]>(this.ubicacionesApiUrl),
      clientes: this.http.get<Cliente[]>(this.clientesApiUrl),
      empresas: this.http.get<Empresa[]>(this.empresasApiUrl)
    }).pipe(
      catchError(err => {
        console.error('Error fetching data:', err);
        this.error = 'No se pudieron cargar los datos. Por favor, intente de nuevo más tarde.';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.ubicaciones = data.ubicaciones.map(ubicacion => {
          // Detectar ID de cliente (puede ser cliente_id o cliente)
          const clienteId = ubicacion.cliente_id ?? ubicacion.cliente ?? null;

          // Si API ya manda objeto cliente completo
          let cliente: Cliente;
          if (ubicacion.cliente && typeof ubicacion.cliente === 'object') {
            cliente = ubicacion.cliente;
          } else {
            cliente = data.clientes.find(c => c.id === clienteId) || { id: null, nombre: 'Cliente no asignado' };
          }

          // Detectar ID de empresa (puede ser empresa_id o empresa)
          const empresaId = ubicacion.empresa_id ?? ubicacion.empresa ?? null;

          let empresa: Empresa;
          if (ubicacion.empresa && typeof ubicacion.empresa === 'object') {
            empresa = ubicacion.empresa;
          } else {
            empresa = data.empresas.find(e => e.id === empresaId) || { id: null, nombre: 'Empresa no asignada' };
          }

          return {
            ...ubicacion,
            cliente,
            empresa
          } as Ubicacion;
        });
      }
      this.isLoading = false;
    });
  }

  /**
   * Getter que devuelve el array de ubicaciones filtrado por nombre, cliente o dirección.
   */
  get filteredUbicaciones(): Ubicacion[] {
    if (!this.searchTerm) {
      return this.ubicaciones;
    }

    const lowerTerm = this.searchTerm.toLowerCase();
    return this.ubicaciones.filter(ubicacion =>
      ubicacion.nombre.toLowerCase().includes(lowerTerm) ||
      ubicacion.cliente?.nombre.toLowerCase().includes(lowerTerm) ||
      ubicacion.direccion.toLowerCase().includes(lowerTerm)
    );
  }

  // Nueva función para exportar las ubicaciones a PDF
  exportUbicacionesToPdf(): void {
    this.http.get(this.exportPdfUrl, { responseType: 'blob' }).subscribe({
      next: (data: Blob) => {
        const downloadUrl = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'ubicaciones.pdf';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      },
      error: err => {
        console.error('Error al exportar el PDF de ubicaciones:', err);
        alert('Error al exportar el archivo. Por favor, inténtelo de nuevo.');
      }
    });
  }

  goToNewLocation(): void {
    this.router.navigate(['/ubicaciones/nueva']);
  }

  viewDetails(ubicacionId: number): void {
    this.router.navigate(['/ubicaciones', ubicacionId]);
  }
}