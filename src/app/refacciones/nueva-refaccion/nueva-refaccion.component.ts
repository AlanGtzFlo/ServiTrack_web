// src/app/refacciones/nueva-refaccion/nueva-refaccion.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ¡IMPRESCINDIBLE para [(ngModel)]!

@Component({
  selector: 'app-nueva-refaccion',
  standalone: true, // ¡ESTO ES CRUCIAL!
  imports: [
    CommonModule,
    FormsModule, // ¡Asegúrate de que FormsModule esté aquí!
    RouterModule
  ],
  templateUrl: './nueva-refaccion.component.html',
  styleUrls: ['./nueva-refaccion.component.scss']
})
export class NuevaRefaccionComponent implements OnInit {
  refaccion: any = {
    nombre: '', descripcion: '', codigo_pieza: '', fabricante: '', imagen: ''
  };
  constructor(private router: Router) { }
  ngOnInit(): void { }
  crearRefaccion(): void {
    console.log('Datos de la nueva refacción:', this.refaccion);
    alert('Refacción creada con éxito (simulado)!');
    this.router.navigate(['/refacciones']);
  }
}