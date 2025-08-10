import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

// Interfaz para el ticket
interface Ticket {
  id: number;
  titulo: string;
}

// Interfaz para el usuario/técnico - CORREGIDA
interface Usuario {
  id: number;
  correo: string; // <-- Corregido para que coincida con el dato de la API
  rol: string;
}

// Interfaz para la ubicación
interface Ubicacion {
  id: number;
  nombre: string;
}

// Interfaz para la empresa
interface Empresa {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-new-report',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './new-report.component.html',
  styleUrls: ['./new-report.component.scss']
})
export class NewReportComponent implements OnInit {
  reportForm: FormGroup;
  
  private reportesUrl = 'https://fixflow-backend.onrender.com/api/reportes/';
  private ticketsUrl = 'https://fixflow-backend.onrender.com/api/tickets/'; 
  private tecnicosUrl = 'https://fixflow-backend.onrender.com/api/usuarios/';
  private ubicacionesUrl = 'https://fixflow-backend.onrender.com/api/ubicaciones/';
  private empresasUrl = 'https://fixflow-backend.onrender.com/api/empresas/';
  
  tickets: Ticket[] = [];
  tecnicos: Usuario[] = [];
  ubicaciones: Ubicacion[] = [];
  empresas: Empresa[] = [];

  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private http: HttpClient
  ) {
    this.reportForm = this.fb.group({
      ticket: ['', Validators.required],
      tecnico: ['', Validators.required],
      ubicacion: ['', Validators.required],
      empresa: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      es_poliza: [false],
      tipo_poliza: [{ value: '', disabled: true }],
      categoria: ['correctivo', Validators.required],
      informacion_reporte: ['']
    });
  }

  ngOnInit(): void {
    this.fetchData();
    this.onChanges();
  }

  fetchData(): void {
    forkJoin({
      tickets: this.http.get<Ticket[]>(this.ticketsUrl),
      tecnicos: this.http.get<Usuario[]>(this.tecnicosUrl),
      ubicaciones: this.http.get<Ubicacion[]>(this.ubicacionesUrl),
      empresas: this.http.get<Empresa[]>(this.empresasUrl)
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (results) => {
        this.tickets = results.tickets;
        this.tecnicos = results.tecnicos.filter(user => user.rol === 'tecnico');
        this.ubicaciones = results.ubicaciones;
        this.empresas = results.empresas;
        
        console.log('Datos cargados correctamente:', {
          tickets: this.tickets,
          tecnicos: this.tecnicos,
          ubicaciones: this.ubicaciones,
          empresas: this.empresas
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar datos desde las APIs:', error);
      }
    });
  }
  
  onChanges(): void {
    this.reportForm.get('es_poliza')?.valueChanges.subscribe(val => {
      const tipoPolizaControl = this.reportForm.get('tipo_poliza');
      if (val) {
        tipoPolizaControl?.enable();
        tipoPolizaControl?.setValidators(Validators.required);
      } else {
        tipoPolizaControl?.disable();
        tipoPolizaControl?.clearValidators();
      }
      tipoPolizaControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.reportForm.valid) {
      const formValue = this.reportForm.value;
      
      const formData = new FormData();
      formData.append('ticket', formValue.ticket);
      formData.append('tecnico', formValue.tecnico);
      formData.append('ubicacion', formValue.ubicacion);
      formData.append('empresa', formValue.empresa);
      formData.append('descripcion', formValue.descripcion);
      formData.append('es_poliza', formValue.es_poliza);
      formData.append('categoria', formValue.categoria);
      formData.append('informacion_reporte', formValue.informacion_reporte);

      if (formValue.es_poliza) {
        formData.append('tipo_poliza', formValue.tipo_poliza);
      }

      this.http.post(this.reportesUrl, formData).subscribe({
        next: (response) => {
          console.log('Reporte creado con éxito!', response);
          this.reportForm.reset({
            categoria: 'correctivo',
            es_poliza: false
          });
          alert('Reporte creado con éxito!');
          this.location.back();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al crear el reporte:', error);
          alert(`Error: ${JSON.stringify(error.error)}`);
        }
      });
    } else {
      console.error('Por favor, completa todos los campos requeridos correctamente.');
      this.reportForm.markAllAsTouched();
    }
  }

  goBack(): void {
    this.location.back();
  }
}