// src/app/refacciones/refacciones.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importa los componentes standalone directamente
import { RefaccionesListComponent } from './refacciones-list/refacciones-list.component';
import { NuevaRefaccionComponent } from './nueva-refaccion/nueva-refaccion.component';

@NgModule({
  // Si RefaccionesListComponent y NuevaRefaccionComponent son standalone,
  // NO deben ir en 'declarations'. Este array debe estar vacío o contener
  // solo componentes NO standalone.
  declarations: [
    // Si estos componentes son standalone, quítalos de aquí.
    // Si no son standalone, entonces sí deben estar aquí.
    // Por los errores previos, asumimos que SÍ son standalone.
  ],
  imports: [
    CommonModule,
    FormsModule, // Importa FormsModule, como lo indicaste.
    // Si RefaccionesListComponent y NuevaRefaccionComponent son standalone,
    // deben ser importados aquí para que los componentes declarados en este
    // módulo (o cualquier otro módulo que importe RefaccionesModule) puedan usarlos.
    RefaccionesListComponent,
    NuevaRefaccionComponent
  ],
  exports: [
    // Si son standalone y quieres que otros módulos que importen RefaccionesModule
    // puedan usarlos, también deben ser exportados aquí.
    RefaccionesListComponent,
    NuevaRefaccionComponent
  ]
})
export class RefaccionesModule { }
