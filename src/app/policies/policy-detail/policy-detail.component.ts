import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { AuthService } from '../../auth.service';

interface Policy {
  id: number;
  nombre: string;
  tipo_poliza: string;
  fecha_inicio_poliza: string;
  fecha_fin_poliza: string;
  estatus: boolean;
}

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss']
})
export class PolicyDetailComponent implements OnInit {
  @ViewChild('policyForm') policyForm!: NgForm;

  policyId: number | null = null;
  policy?: Policy;
  policyToEdit?: Policy;
  isEditing: boolean = false;

  isAdmin: boolean = false;

  // Solo los tipos que aparecen en tu JSON
  tiposPoliza = [
    { value: 'externa', label: 'Externa' },
    { value: 'interna', label: 'Interna' }
  ];

  private apiUrl = 'https://fixflow-backend.onrender.com/api/empresas/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.policyId = Number(id);
        this.loadPolicyData(this.policyId);
      } else {
        console.warn('No se proporcionó un ID de póliza.');
        this.router.navigate(['/policies']);
      }
    });

    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  loadPolicyData(id: number): void {
    this.http.get<Policy>(`${this.apiUrl}${id}/`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al cargar la póliza', error);
          return of(undefined);
        })
      )
      .subscribe(data => {
        if (data) {
          this.policy = data;
        } else {
          this.policy = undefined;
        }
      });
  }

  goToPoliciesList(): void {
    this.router.navigate(['/policies']);
  }

  editPolicy(): void {
    if (this.policy) {
      this.policyToEdit = { ...this.policy };
      this.isEditing = true;
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.policyToEdit = undefined;
  }

  getTipoPolizaLabel(tipoValue: string): string {
    const tipo = this.tiposPoliza.find(t => t.value === tipoValue);
    return tipo ? tipo.label : tipoValue || 'No especificado';
  }

  saveChanges(): void {
    if (!this.policyToEdit || !this.policyId) return;

    if (this.policyForm.invalid) {
      this.policyForm.control.markAllAsTouched();
      return;
    }

    this.http.put<Policy>(`${this.apiUrl}${this.policyId}/`, this.policyToEdit)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al guardar cambios', error);
          return of(undefined);
        })
      )
      .subscribe(updatedPolicy => {
        if (updatedPolicy) {
          this.policy = updatedPolicy;
          this.isEditing = false;
          this.policyToEdit = undefined;
        }
      });
  }

  deletePolicy(): void {
    if (!this.policyId) return;

    if (confirm('¿Estás seguro de eliminar esta póliza?')) {
      this.http.delete(`${this.apiUrl}${this.policyId}/`)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            console.error('Error al eliminar la póliza', error);
            return of(undefined);
          })
        )
        .subscribe(() => {
          this.router.navigate(['/policies']);
        });
    }
  }
}
