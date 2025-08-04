// src/app/settings/notifications-settings/notifications-settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notifications-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications-settings.component.html',
  styleUrls: ['./notifications-settings.component.scss'] // Puedes dejar vacío o usar estilos compartidos
})
export class NotificationsSettingsComponent implements OnInit {
  // Notificaciones para administradores/supervisores
  adminNewService: boolean = true;
  adminServiceStatusChange: boolean = true;
  adminLowStockAlert: boolean = false; // Ejemplo de futura funcionalidad

  // Notificaciones para técnicos
  technicianAssignedService: boolean = true;
  technicianServiceDueSoon: boolean = true;
  technicianClientMessage: boolean = true;

  // Notificaciones para clientes (ejemplo de lo que enviarías)
  clientServiceUpdate: boolean = true;
  clientServiceCompletion: boolean = true;
  clientNewInvoice: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // Cargar configuraciones de notificación desde una API
    console.log('Cargando configuración de notificaciones...');
  }

  saveNotificationSettings(): void {
    // Aquí enviarías los datos a tu API de backend
    console.log('Guardando configuración de notificaciones:', {
      adminNewService: this.adminNewService,
      adminServiceStatusChange: this.adminServiceStatusChange,
      adminLowStockAlert: this.adminLowStockAlert,
      technicianAssignedService: this.technicianAssignedService,
      technicianServiceDueSoon: this.technicianServiceDueSoon,
      technicianClientMessage: this.technicianClientMessage,
      clientServiceUpdate: this.clientServiceUpdate,
      clientServiceCompletion: this.clientServiceCompletion,
      clientNewInvoice: this.clientNewInvoice
    });
    alert('Configuración de notificaciones guardada (simulado).');
  }
}