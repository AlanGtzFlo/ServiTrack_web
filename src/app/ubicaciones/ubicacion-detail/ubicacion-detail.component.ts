// src/app/ubicaciones/ubicacion-detail/ubicacion-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, switchMap, catchError, of } from 'rxjs';

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

// Interfaz para la estructura de tu API de Ubicaciones
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
  selector: 'app-ubicacion-detail',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './ubicacion-detail.component.html',
  styleUrls: ['./ubicacion-detail.component.scss']
})
export class UbicacionDetailComponent implements OnInit {
  ubicacionId: string | null = null;
  ubicacion!: Ubicacion;
  clientes: Cliente[] = [];
  empresas: Empresa[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  isEditing = false;
  ubicacionForm!: FormGroup;
  showStatusConfirmation = false;
  
  private ubicacionesApiUrl = 'https://fixflow-backend.onrender.com/api/ubicaciones';
  private clientesApiUrl = 'https://fixflow-backend.onrender.com/api/clientes';
  private empresasApiUrl = 'https://fixflow-backend.onrender.com/api/empresas';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.ubicacionId = params.get('id');
        this.isLoading = true;
        this.errorMessage = null;

        if (this.ubicacionId) {
          return forkJoin({
            ubicacion: this.http.get<Ubicacion>(`${this.ubicacionesApiUrl}/${this.ubicacionId}`),
            clientes: this.http.get<Cliente[]>(this.clientesApiUrl),
            empresas: this.http.get<Empresa[]>(this.empresasApiUrl)
          }).pipe(
            catchError(error => {
              console.error('Error al obtener los datos:', error);
              this.errorMessage = 'No se pudieron obtener los datos. Verifique el ID o la conexión.';
              return of(null);
            })
          );
        }
        return of(null);
      })
    ).subscribe(data => {
      if (data) {
        this.ubicacion = data.ubicacion;
        this.clientes = data.clientes;
        this.empresas = data.empresas;
        this.initForm();
      }
      this.isLoading = false;
    });
  }

  // Inicializa el formulario reactivo
  initForm(): void {
    this.ubicacionForm = this.fb.group({
      nombre: [this.ubicacion.nombre, Validators.required],
      direccion: [this.ubicacion.direccion, Validators.required],
      clienteId: [this.ubicacion.cliente?.id, Validators.required],
      empresaId: [this.ubicacion.empresa?.id, Validators.required],
      contacto: [this.ubicacion.contacto, Validators.required],
    });
  }

  // Activa el modo de edición y copia los valores al formulario
  onEditClick(): void {
    this.isEditing = true;
  }

  // Guarda los cambios con una solicitud PUT
  onSaveEdit(): void {
    if (this.ubicacionForm.valid && this.ubicacion) {
      // ** MODIFICACIÓN CLAVE: En lugar de enviar los objetos completos,
      // enviamos los IDs como 'cliente_id' y 'empresa_id' tal como los espera tu API. **
      const updatedUbicacion = {
        id: this.ubicacion.id,
        nombre: this.ubicacionForm.value.nombre,
        direccion: this.ubicacionForm.value.direccion,
        cliente_id: this.ubicacionForm.value.clienteId, // <-- Cambio aquí
        empresa_id: this.ubicacionForm.value.empresaId, // <-- Cambio aquí
        contacto: this.ubicacionForm.value.contacto,
        estatus: this.ubicacion.estatus, // Mantener el estatus actual
      };

      console.log('Enviando PUT a la API con los siguientes datos:', updatedUbicacion);

      this.http.put<Ubicacion>(`${this.ubicacionesApiUrl}/${this.ubicacion.id}/`, updatedUbicacion).subscribe({
        next: (response) => {
          console.log('Ubicación actualizada con éxito:', response);
          this.ubicacion = response;
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error al actualizar la ubicación:', error);
          this.errorMessage = 'Error al actualizar la ubicación. Inténtalo de nuevo.';
        }
      });
    }
  }

  // Cancela la edición y restablece el formulario a los valores originales
  onCancelEdit(): void {
    this.isEditing = false;
    this.ubicacionForm.reset({
      nombre: this.ubicacion.nombre,
      direccion: this.ubicacion.direccion,
      clienteId: this.ubicacion.cliente.id,
      empresaId: this.ubicacion.empresa.id,
      contacto: this.ubicacion.contacto,
    });
  }

  // Activa el modal de confirmación
  onToggleStatusClick(): void {
    this.showStatusConfirmation = true;
  }

  // Confirma el cambio de estado y lo envía a la API
  confirmToggleStatus(): void {
    if (this.ubicacion) {
      const nuevoEstatus = !this.ubicacion.estatus;
      this.http.patch<Ubicacion>(`${this.ubicacionesApiUrl}/${this.ubicacion.id}/`, { estatus: nuevoEstatus }).subscribe({
        next: (response) => {
          console.log('Estado actualizado con éxito:', response);
          this.ubicacion.estatus = response.estatus;
          this.showStatusConfirmation = false;
        },
        error: (error) => {
          console.error('Error al actualizar el estado:', error);
          this.errorMessage = 'Error al cambiar el estado. Inténtalo de nuevo.';
          this.showStatusConfirmation = false;
        }
      });
    }
  }

  // Cancela el modal de confirmación
  cancelToggleStatus(): void {
    this.showStatusConfirmation = false;
  }

  // Navega de regreso a la lista de ubicaciones
  goBack(): void {
    this.router.navigate(['/ubicaciones']);
  }
}