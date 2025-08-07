// policies.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Policy {
  id: number;
  nombre: string;
  tipo_poliza: string | null;
  fecha_inicio_poliza: string | null;
  fecha_fin_poliza: string | null;
  estatus: boolean;
}

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {

  policies: Policy[] = [];

  searchTerm: string = '';
  filterStatus: 'all' | 'Activo' | 'Inactivo' = 'all';

  private apiUrl = 'https://fixflow-backend.onrender.com/api/empresas/';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.http.get<Policy[]>(this.apiUrl).subscribe({
      next: data => {
        this.policies = data;
      },
      error: err => {
        console.error('Error cargando pólizas', err);
        alert('Error al cargar las pólizas.');
      }
    });
  }

  get filteredPolicies(): Policy[] {
    let result = this.policies;

    if (this.searchTerm) {
      const lowerTerm = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(lowerTerm) ||
        (p.tipo_poliza ? p.tipo_poliza.toLowerCase().includes(lowerTerm) : false)
      );
    }

    if (this.filterStatus !== 'all') {
      const statusBool = this.filterStatus === 'Activo';
      result = result.filter(p => p.estatus === statusBool);
    }

    return result;
  }

  addNewPolicy(): void {
    // Navegar o abrir modal para crear nueva póliza
    console.log('Abrir formulario para nueva póliza');
    this.router.navigate(['/policies/new']);
  }
}
