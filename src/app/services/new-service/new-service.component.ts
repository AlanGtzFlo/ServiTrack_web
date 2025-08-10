import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Interfaz para el usuario/técnico
interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

// Interfaz para la ubicación
interface Ubicacion {
  id: number;
  nombre: string;
  direccion: string;
}

// Interfaz para el nuevo servicio/ticket con nombres de campo ajustados
interface NewService {
  titulo: string;
  descripcion: string;
  prioridad: string;
  estado: string;
  fecha_limite: string;
  ubicacion?: number; 
  usuario_creador: number; 
  tecnico_asignado?: number;
}

@Component({
  selector: 'app-new-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {

  // Endpoints reales proporcionados por el usuario
  private usuariosApiUrl = 'https://fixflow-backend.onrender.com/api/usuarios/';
  private ubicacionesApiUrl = 'https://fixflow-backend.onrender.com/api/ubicaciones/';
  private ticketsApiUrl = 'https://fixflow-backend.onrender.com/api/tickets/';

  // Arreglos para almacenar los datos de la API
  clients: Usuario[] = [];
  technicians: Usuario[] = [];
  ubicaciones: Ubicacion[] = [];

  // **CORRECCIÓN:** Arreglo de prioridades con valores en minúscula para coincidir con la API
  priorities: string[] = ['baja', 'media', 'alta'];
  // **CORRECCIÓN:** Arreglo de estados con valores en minúscula para coincidir con la API
  statuses: string[] = ['pendiente', 'en_proceso', 'completado', 'cerrado'];

  // Objeto para el nuevo servicio con los nuevos nombres de campo
  newService: NewService = {
    titulo: '',
    descripcion: '',
    prioridad: '',
    estado: '',
    fecha_limite: '',
    ubicacion: undefined,
    usuario_creador: 0, 
    tecnico_asignado: undefined
  };

  // Variable de estado para controlar la carga de datos
  isLoading: boolean = true;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    forkJoin({
      usuarios: this.getUsuarios(),
      ubicaciones: this.getUbicaciones()
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (results) => {
        const { usuarios, ubicaciones } = results;
        this.clients = usuarios;
        this.technicians = usuarios.filter(user => user.rol === 'tecnico');
        this.ubicaciones = ubicaciones;

        console.log('Datos cargados correctamente:', {
          clients: this.clients,
          technicians: this.technicians,
          ubicaciones: this.ubicaciones
        });

        // Establece los valores predeterminados para el formulario
        this.newService.prioridad = this.priorities[0];
        // Se establece el estado predeterminado como 'pendiente'
        this.newService.estado = 'pendiente';
        this.newService.fecha_limite = new Date().toISOString().split('T')[0];
      },
      error: (error) => {
        console.error('Error al cargar datos desde las APIs:', error);
      }
    });
  }

  private getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.usuariosApiUrl);
  }

  private getUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.ubicacionesApiUrl);
  }

  saveNewService(): void {
    if (!this.validateForm()) {
      console.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    console.log('Guardando nuevo servicio:', this.newService);
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post(this.ticketsApiUrl, this.newService, { headers }).subscribe({
      next: (response) => {
        console.log('Servicio guardado con éxito:', response);
        this.router.navigate(['/services']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar el servicio:', error.error);
        if (error.error && typeof error.error === 'object') {
            for (const key in error.error) {
                if (error.error.hasOwnProperty(key)) {
                    console.error(`Error en el campo "${key}": ${error.error[key]}`);
                }
            }
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/services']);
  }

  private validateForm(): boolean {
    return !!this.newService.titulo &&
             !!this.newService.descripcion &&
             !!this.newService.prioridad &&
             !!this.newService.estado &&
             !!this.newService.fecha_limite &&
             this.newService.usuario_creador > 0;
  }
}
