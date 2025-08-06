// src/app/refacciones/refacciones-list/refacciones-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas como *ngIf, *ngFor
import { RouterModule } from '@angular/router'; // Para routerLink

@Component({
  selector: 'app-refacciones-list',
  standalone: true, // ¡ESTO ES CRUCIAL!
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './refacciones-list.component.html',
  styleUrls: ['./refacciones-list.component.scss']
})
export class RefaccionesListComponent implements OnInit {
  // ... tu código existente
  constructor() { }
  ngOnInit(): void { }
  getStatusClass(status: string): string {
    switch (status) {
      case 'Disponible': return 'status-success';
      case 'Agotado': return 'status-error';
      case 'Bajo Stock': return 'status-pending';
      default: return '';
    }
  }
}