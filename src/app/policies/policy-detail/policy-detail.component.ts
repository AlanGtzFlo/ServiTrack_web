import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
<<<<<<< HEAD
import { AuthService } from '../../auth.service'; // Importa el servicio de autenticación

// Interfaz con los campos que solicitaste
=======

// ✅ Interfaz actualizada para que coincida con lo que me mostraste
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
interface Policy {
  id: number;
  nombre: string;
  tipo_poliza: string;
  fecha_inicio_poliza: string;
  fecha_fin_poliza: string;
  estatus: boolean;
<<<<<<< HEAD
=======
  description: string;
  terms: string;
  coveredItems: string;
  notes: string;
  assignedAgent: string;
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
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
<<<<<<< HEAD
  isAdmin: boolean = false; // Nueva propiedad para controlar el rol

  private apiUrl = 'https://fixflow-backend.onrender.com/api/empresas/';

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}
=======

  private apiUrl = 'https://fixflow-backend.onrender.com/api/empresas/';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0

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

    // Suscribirse al rol del usuario para actualizar el estado de 'isAdmin'
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
  }

  loadPolicyData(id: number): void {
    this.http.get<Policy>(`${this.apiUrl}${id}/`).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error cargando póliza:', err);
<<<<<<< HEAD
        // Reemplazar alert() por un manejo de errores en consola o un modal
        console.error('No se pudo cargar la información de la póliza.'); 
=======
        alert('No se pudo cargar la información de la póliza.');
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
        this.router.navigate(['/policies']);
        return EMPTY;
      })
    ).subscribe(policy => {
      this.policy = policy;
      this.policyToEdit = policy ? { ...policy } : undefined;
    });
  }

  editPolicy(): void {
<<<<<<< HEAD
    if (this.isAdmin) {
      this.isEditing = true;
    }
  }

  saveChanges(): void {
    if (!this.policyToEdit || !this.policyToEdit.id) return;
    this.http.put(`${this.apiUrl}${this.policyToEdit.id}/`, this.policyToEdit).subscribe({
      next: () => {
        // Reemplazar alert()
        console.log('Póliza actualizada con éxito.');
        this.isEditing = false;
        this.loadPolicyData(this.policyToEdit!.id);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al guardar cambios:', err);
        // Reemplazar alert()
        console.error('No se pudieron guardar los cambios.');
      }
    });
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.policyToEdit = this.policy ? { ...this.policy } : undefined;
  }

  deletePolicy(): void {
    if (!this.policy || !this.policy.id) return;
    // Reemplazar confirm() por un manejo de confirmación en consola o un modal
    console.log(`Petición para eliminar la póliza ${this.policy.nombre}`);
    this.http.delete(`${this.apiUrl}${this.policy.id}/`).subscribe({
      next: () => {
        // Reemplazar alert()
        console.log('Póliza eliminada correctamente.');
        this.router.navigate(['/policies']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error eliminando póliza:', err);
        // Reemplazar alert()
        console.error('No se pudo eliminar la póliza.');
      }
    });
  }

  goToPoliciesList(): void {
    this.router.navigate(['/policies']);
  }
=======
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
>>>>>>> 23687cc9e835377831bebdbc1ffeb927aad3fcc0
}