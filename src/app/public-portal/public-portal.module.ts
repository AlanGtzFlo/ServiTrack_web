// src/app/public-portal/public-portal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Componentes del portal público (todos son STANDALONE)
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ServiceStatusComponent } from './service-status/service-status.component';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { AboutPageComponent } from './about-page/about-page.component';

@NgModule({
  // ¡IMPORTANTE! Si los componentes son `standalone: true`, NO se declaran aquí.
  // declarations: [
  //   PublicLayoutComponent,
  //   HomePageComponent,
  //   ServiceStatusComponent,
  //   FeedbackFormComponent,
  //   AboutPageComponent
  // ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, // Importa RouterModule para directivas de enrutamiento

    // ¡IMPORTANTE! Los componentes standalone se importan directamente aquí
    PublicLayoutComponent,
    HomePageComponent,
    ServiceStatusComponent,
    FeedbackFormComponent,
    AboutPageComponent
  ],
  exports: [
    // Si algún componente de este módulo necesita ser usado fuera de él, se exporta aquí.
    // Generalmente, no exportarías componentes de layout o página aquí, sino componentes compartidos.
    // Por ejemplo, si tuvieras un componente "PublicButtonComponent" que usas en varios lugares.
  ]
})
export class PublicPortalModule { }