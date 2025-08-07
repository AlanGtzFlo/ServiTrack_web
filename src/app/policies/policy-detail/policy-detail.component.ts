// src/app/policies/policy-detail/policy-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';

// ✅ Interfaz actualizada para que coincida con lo que me mostraste
interface Policy {
  id: number;
  nombre: string;
  tipo_poliza: string;
  fecha_inicio_poliza: string;
  fecha_fin_poliza: string;
  estatus: boolean;
  description: string;
  terms: string;
  coveredItems: string;
  notes: string;
  assignedAgent: string;
}

@Component({
  selector: 'app-policy-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './policy-detail.component.html',
  styleUrls: ['./policy-detail.component.scss']
})
export class PolicyDetailComponent implements OnInit {
  policyId: number | null = null;
  policy?: Policy;
  policyToEdit?: Policy;
  isEditing: boolean = false;

  private apiUrl = 'https://fixflow-backend.onrender.com/api/empresas/';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

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
  }

  loadPolicyData(id: number): void {
    this.http.get<Policy>(`${this.apiUrl}${id}/`).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error cargando póliza:', err);
        alert('No se pudo cargar la información de la póliza.');
        this.router.navigate(['/policies']);
        return EMPTY;
      })
    ).subscribe(policy => {
      this.policy = policy;
      this.policyToEdit = policy ? { ...policy } : undefined;
    });
  }

  editPolicy(): void {
    this.isEditing = true;
  }

  saveChanges(): void {
    if (!this.policyToEdit || !this.policyToEdit.id) return;
    this.http.put(`${this.apiUrl}${this.policyToEdit.id}/`, this.policyToEdit).subscribe({
      next: () => {
        alert('Póliza actualizada con éxito.');
        this.isEditing = false;
        this.loadPolicyData(this.policyToEdit!.id);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar cambios:', err);
        alert('No se pudieron guardar los cambios.');
      }
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.policyToEdit = this.policy ? { ...this.policy } : undefined;
  }

  deletePolicy(): void {
    if (!this.policy || !this.policy.id) return;
    if (confirm(`¿Estás seguro de que quieres eliminar la póliza ${this.policy.nombre}?`)) {
      this.http.delete(`${this.apiUrl}${this.policy.id}/`).subscribe({
        next: () => {
          alert('Póliza eliminada correctamente.');
          this.router.navigate(['/policies']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error eliminando póliza:', err);
          alert('No se pudo eliminar la póliza.');
        }
      });
    }
  }

  goToPoliciesList(): void {
    this.router.navigate(['/policies']);
  }

  // ✅ Se elimina la navegación al detalle de cliente ya que no existe en la nueva interfaz
  // goToClientDetail(clientId: number): void {
  //   this.router.navigate(['/clients', clientId]);
  // }
}