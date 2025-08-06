// src/app/settings/settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  activeSection: string = 'general'; // Define la sección activa por defecto

  constructor() { }

  ngOnInit(): void {
    // Puedes inicializar la sección activa basándote en la ruta actual si lo deseas
  }

  // Método para cambiar la sección activa
  setActiveSection(section: string): void {
    this.activeSection = section;
  }
}