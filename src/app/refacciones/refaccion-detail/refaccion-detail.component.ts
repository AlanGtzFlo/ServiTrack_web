// src/app/refacciones/refaccion-detail/refaccion-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // Necesitas ActivatedRoute para obtener el ID
import { delay, of, switchMap } from 'rxjs'; // Importamos operadores de RxJS para simular una carga de datos

// Define una interfaz para la estructura de tu objeto Refaccion (opcional pero muy recomendado)
interface Refaccion {
  id: string;
  name: string;
  partNumber: string;
  machineModel: string;
  stock: number;
  notes: string;
  imageUrl?: string; // Opcional si no todas tienen imagen
}

@Component({
  selector: 'app-refaccion-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './refaccion-detail.component.html',
  styleUrls: ['./refaccion-detail.component.scss']
})
export class RefaccionDetailComponent implements OnInit {
  refaccionId: string | null = null;
  refaccion: Refaccion | undefined; // Propiedad para almacenar los detalles de la refacción
  isLoading: boolean = true; // Para mostrar un spinner o mensaje de carga

  // Propiedades individuales para el HTML (redundante si usas refaccion.propiedad, pero útil si prefieres la desestructuración o acceso directo)
  refaccionName: string | undefined;
  refaccionPartNumber: string | undefined;
  refaccionMachineModel: string | undefined;
  refaccionStock: number | undefined;
  refaccionNotes: string | undefined;
  refaccionImageUrl: string | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      // switchMap cancela la suscripción anterior si el parámetro cambia rápidamente
      switchMap(params => {
        this.refaccionId = params.get('id');
        this.isLoading = true; // Empieza la carga
        console.log('ID de Refacción:', this.refaccionId);

        // Aquí simularías la llamada a tu servicio de refacciones
        // Por ahora, usamos un 'of' con un 'delay' para simular una respuesta asíncrona
        if (this.refaccionId === 'ABC-12345') {
          return of({
            id: 'ABC-12345',
            name: 'Engranaje de Alimentación',
            partNumber: 'ABC-12345',
            machineModel: 'TicketMaster X200',
            stock: 50,
            notes: 'Este engranaje es esencial para el sistema de alimentación de papel.',
            imageUrl: 'https://via.placeholder.com/400x250?text=Engranaje+de+Alimentacion' // Imagen de ejemplo
          }).pipe(delay(500)); // Simula un retraso de 500ms
        } else if (this.refaccionId === 'XYZ-67890') {
          return of({
            id: 'XYZ-67890',
            name: 'Sensor Óptico',
            partNumber: 'XYZ-67890',
            machineModel: 'FastTicket 5000',
            stock: 0,
            notes: 'Sensor crucial para la detección de tickets. ¡Requiere reabastecimiento urgente!',
            imageUrl: 'https://via.placeholder.com/400x250?text=Sensor+Optico' // Imagen de ejemplo
          }).pipe(delay(500));
        } else {
          // Si el ID no coincide, simula que no se encontró
          return of(undefined).pipe(delay(500));
        }
      })
    ).subscribe(data => {
      this.refaccion = data; // Asigna los datos a la propiedad 'refaccion'
      if (this.refaccion) {
        // Asigna también a las propiedades individuales para facilitar el uso en el HTML
        this.refaccionName = this.refaccion.name;
        this.refaccionPartNumber = this.refaccion.partNumber;
        this.refaccionMachineModel = this.refaccion.machineModel;
        this.refaccionStock = this.refaccion.stock;
        this.refaccionNotes = this.refaccion.notes;
        this.refaccionImageUrl = this.refaccion.imageUrl;
      } else {
        // Limpia las propiedades si no se encontró la refacción
        this.refaccionName = undefined;
        this.refaccionPartNumber = undefined;
        this.refaccionMachineModel = undefined;
        this.refaccionStock = undefined;
        this.refaccionNotes = undefined;
        this.refaccionImageUrl = undefined;
      }
      this.isLoading = false; // Finaliza la carga
    });
  }
}