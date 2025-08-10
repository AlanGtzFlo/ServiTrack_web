import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

// Interfaz corregida para el ticket, usando 'titulo' en lugar de 'nombre'
interface Ticket {
  id: number;
  titulo: string;
}

@Component({
  selector: 'app-message-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './message-report-form.component.html',
  
})
export class MessageReportFormComponent implements OnInit {
  
  messageForm: FormGroup;
  
  // URLs de las APIs
  private mensajesReporteUrl = 'https://fixflow-backend.onrender.com/api/mensajes_reporte/';
  private ticketsUrl = 'https://fixflow-backend.onrender.com/api/tickets/';
  
  tickets: Ticket[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  selectedImage: File | null = null;
  selectedImageName: string = 'Ningún archivo seleccionado';

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private http: HttpClient,
    private router: Router
  ) {
    // Configuración del formulario reactivo
    this.messageForm = this.fb.group({
      reporte: ['', Validators.required],
      mensaje: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.fetchTickets();
  }

  /**
   * Obtiene la lista de tickets desde la API.
   */
  fetchTickets(): void {
    this.isLoading = true;
    this.http.get<Ticket[]>(this.ticketsUrl)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (tickets) => {
          this.tickets = tickets;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Error al cargar los tickets. Por favor, inténtalo de nuevo más tarde.';
          console.error('Error al cargar tickets:', error);
        }
      });
  }

  /**
   * Maneja la selección de un archivo de imagen.
   * @param event Evento de cambio del input de tipo file.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.selectedImageName = this.selectedImage.name;
    } else {
      this.selectedImage = null;
      this.selectedImageName = 'Ningún archivo seleccionado';
    }
  }

  /**
   * Envía los datos del formulario a la API.
   */
  onSubmit(): void {
    if (this.messageForm.valid) {
      const formValue = this.messageForm.value;
      const formData = new FormData();
      
      formData.append('reporte', formValue.reporte);
      formData.append('mensaje', formValue.mensaje);
      if (this.selectedImage) {
        formData.append('imagen', this.selectedImage, this.selectedImage.name);
      }
      
      this.http.post(this.mensajesReporteUrl, formData).subscribe({
        next: (response) => {
          console.log('Mensaje de reporte creado con éxito!', response);
          // TODO: Muestra un mensaje de éxito al usuario usando una variable de estado
          // en lugar de 'alert()', que bloquea la interfaz.
          // Por ejemplo: this.successMessage = 'Mensaje de reporte creado con éxito!';
          this.messageForm.reset();
          this.selectedImage = null;
          this.selectedImageName = 'Ningún archivo seleccionado';
          this.location.back();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Error al crear el mensaje de reporte: ${JSON.stringify(error.error)}`;
          console.error('Error al crear el mensaje:', error);
          // TODO: Muestra el mensaje de error al usuario usando una variable de estado
          // en lugar de 'alert()'.
          // Por ejemplo: this.errorMessage = `Error: ${JSON.stringify(error.error)}`;
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      this.messageForm.markAllAsTouched();
    }
  }

  /**
   * Navega de vuelta a la página anterior.
   */
  goBack(): void {
    this.location.back();
  }
}
