// src/app/new-report/new-report.component.ts
import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // Importa Location
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent {
  reportForm;

  constructor(
    private fb: FormBuilder,
    private location: Location // Inyecta el servicio Location
  ) {
    this.reportForm = this.fb.group({
      tecnico: ['test@test.com', Validators.required],
      ubicacion: ['', Validators.required],
      empresa: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      esPoliza: [false],
      tipoPoliza: [''],
      categoria: ['En Asignacion', Validators.required],
      informacionReporte: [''],
      mediaType: ['multipart/form-data', Validators.required],
      content: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.reportForm.valid) {
      console.log('Formulario válido. Datos:', this.reportForm.value);
      // Aquí puedes enviar los datos a un servicio o API
      // En lugar de alert, usaremos console.log o un modal personalizado
      console.log('Reporte creado con éxito! (Simulado)');
      // Resetea el formulario a sus valores iniciales
      this.reportForm.reset({
        tecnico: 'test@test.com',
        categoria: 'En Asignacion',
        mediaType: 'multipart/form-data',
        esPoliza: false
      });
    } else {
      console.error('Por favor, completa todos los campos requeridos correctamente.');
      // Marca todos los campos como "touched" para mostrar los errores de validación
      this.reportForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.location.back(); // Función para regresar a la vista anterior
  }
}