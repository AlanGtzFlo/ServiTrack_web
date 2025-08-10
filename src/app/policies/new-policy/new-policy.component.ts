import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

interface Policy {
  nombre: string;
  tipo_poliza: string;
  fecha_inicio_poliza: string;
  fecha_fin_poliza: string;
  estatus: boolean;
}

@Component({
  selector: 'app-new-policy',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './new-policy.component.html',
  styleUrls: ['./new-policy.component.scss']
})
export class NewPolicyComponent implements OnInit {
  newPolicy: Policy = {
    nombre: '',
    tipo_poliza: '',
    fecha_inicio_poliza: '',
    fecha_fin_poliza: '',
    estatus: true
  };

  // ✅ CORREGIDO: Valores en minúsculas para coincidir con la validación del backend.
  tiposPoliza: string[] = ['completa', 'preventivos', 'correctivos'];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.newPolicy.tipo_poliza = this.tiposPoliza[0];
    this.newPolicy.fecha_inicio_poliza = this.getTodayDate();
    this.newPolicy.fecha_fin_poliza = this.getOneYearLaterDate();
  }

  saveNewPolicy(): void {
    if (!this.newPolicy.nombre || this.newPolicy.nombre.trim() === '') {
      alert('El nombre de la póliza no puede estar vacío.');
      return;
    }

    console.log('Datos a enviar:', this.newPolicy);

    this.http.post<Policy>('https://fixflow-backend.onrender.com/api/empresas/', this.newPolicy).subscribe({
      next: (response) => {
        alert('Póliza guardada con éxito.');
        this.router.navigate(['/policies']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al guardar póliza:', error);

        if (error.status === 400) {
          alert('Error de validación: Revisa que todos los campos sean correctos.');
        } else {
          alert('Ocurrió un error en el servidor, por favor, inténtalo de nuevo.');
        }
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/policies']);
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getOneYearLaterDate(): string {
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    return oneYearLater.toISOString().split('T')[0];
  }
}