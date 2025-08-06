// src/app/settings/general-settings/general-settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'] // Puedes dejar vacío o usar estilos compartidos
})
export class GeneralSettingsComponent implements OnInit {
  appName: string = 'FixFlow';
  companyName: string = 'Servicios Técnicos Integrales S.A. de C.V.';
  defaultLanguage: string = 'es';
  dateFormat: string = 'YYYY-MM-DD';
  timeZone: string = 'America/Mexico_City';
  allowClientRegistration: boolean = true;
  maxFileSizeMB: number = 10;

  languages = [
    { value: 'es', label: 'Español' },
    { value: 'en', label: 'Inglés' }
  ];

  dateFormats = [
    { value: 'YYYY-MM-DD', label: 'AAAA-MM-DD' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/AAAA' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/AAAA' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí podrías cargar la configuración actual desde una API
    console.log('Cargando configuración general...');
  }

  saveGeneralSettings(): void {
    // Aquí enviarías los datos a tu API de backend
    console.log('Guardando configuración general:', {
      appName: this.appName,
      companyName: this.companyName,
      defaultLanguage: this.defaultLanguage,
      dateFormat: this.dateFormat,
      timeZone: this.timeZone,
      allowClientRegistration: this.allowClientRegistration,
      maxFileSizeMB: this.maxFileSizeMB
    });
    alert('Configuración general guardada (simulado).');
  }
}