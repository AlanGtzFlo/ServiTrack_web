// src/app/public-portal/feedback-form/feedback-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel en el formulario

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importar FormsModule
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {

  // Modelo para el formulario de feedback
  feedback = {
    serviceCode: '',
    rating: 0, // Escala de 1 a 5
    comment: '',
    name: '',
    email: ''
  };

  submitted: boolean = false; // Para mostrar mensaje de éxito
  errorMessage: string = ''; // Para mostrar errores de validación

  constructor() { }

  ngOnInit(): void {
  }

  // Método para manejar el envío del formulario
  submitFeedback(): void {
    this.submitted = false;
    this.errorMessage = '';

    // Validación básica
    if (!this.feedback.serviceCode || !this.feedback.rating || !this.feedback.comment || !this.feedback.name || !this.feedback.email) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    // Aquí iría la lógica para enviar el feedback a un servicio/API
    console.log('Comentario enviado:', this.feedback);

    // Simulación de éxito
    this.submitted = true;
    // Resetear el formulario después de un envío exitoso (opcional)
    this.feedback = { serviceCode: '', rating: 0, comment: '', name: '', email: '' };

    // En un caso real, podrías redirigir al usuario o mostrar un modal de éxito más sofisticado.
  }

  // Para manejar el cambio de calificación por estrellas si se implementa
  setRating(stars: number): void {
    this.feedback.rating = stars;
  }
}