import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Reporte {
  id: number;
  descripcion: string;
}

@Component({
  selector: 'app-message-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './message-report-form.component.html',
})
export class MessageReportFormComponent implements OnInit {

  messageForm: FormGroup;

  private mensajesReporteUrl = 'https://fixflow-backend.onrender.com/api/mensajes_reporte/';
  private reportesUrl = 'https://fixflow-backend.onrender.com/api/reportes/';

  reportes: Reporte[] = [];
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
    this.messageForm = this.fb.group({
      reporte: ['', Validators.required],
      mensaje: ['', Validators.required],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.fetchReportes();
  }

  fetchReportes(): void {
    this.isLoading = true;
    this.http.get<Reporte[]>(this.reportesUrl)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (reportes) => {
          this.reportes = reportes;
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Error al cargar los reportes. Intenta de nuevo más tarde.';
          console.error('Error al cargar reportes:', error);
        }
      });
  }

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
          this.messageForm.reset();
          this.selectedImage = null;
          this.selectedImageName = 'Ningún archivo seleccionado';
          this.location.back();
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Error al crear el mensaje de reporte: ${JSON.stringify(error.error)}`;
          console.error('Error al crear mensaje:', error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      this.messageForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
