// src/app/public-portal/feedback-form/feedback-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaces para tipado seguro
interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  tecnico_asignado: number;
}

interface Usuario {
  id: number;
  nombre: string;
  rol: string;
}

interface Feedback {
  calificacion: number;
  comentario: string;
  ticket: number | null;
  tecnico: number | null;
}

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1 class="page-title">Déjanos tu Comentario</h1>
        <p class="page-description">Tu opinión es muy importante para nosotros. Ayúdanos a mejorar nuestros servicios.</p>
      </div>

      <div class="feedback-form-card">
        <form (ngSubmit)="submitFeedback()">
          <div class="form-group">
            <label for="calificacion">Calificación</label>
            <div class="rating-stars">
              <span class="material-icons star"
                      *ngFor="let star of [1, 2, 3, 4, 5]"
                      [ngClass]="{'filled': star <= feedback.calificacion}"
                      (click)="setRating(star)">
                star
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="comentario">Comentario</label>
            <textarea id="comentario" name="comentario" [(ngModel)]="feedback.comentario" rows="5" placeholder="Escribe tu experiencia aquí..." required></textarea>
          </div>

          <div class="form-group">
            <label for="ticket_id">ID del Ticket</label>
            <input type="number" id="ticket_id" name="ticket_id" [(ngModel)]="feedback.ticket" (ngModelChange)="onTicketIdChange()" placeholder="Ingresa el ID del ticket" required>
          </div>

          <div class="form-group">
            <label for="tecnico">Técnico Asignado</label>
            <input type="text" id="tecnico" name="tecnico" [value]="tecnicoSeleccionado ? tecnicoSeleccionado.nombre : '-----'" disabled>
          </div>

          <div *ngIf="errorMessage" class="alert alert-error">
            {{ errorMessage }}
          </div>

          <div *ngIf="submitted" class="alert alert-success">
            ¡Gracias por tu comentario! Lo valoramos mucho.
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Enviar comentario</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-container { max-width: 600px; margin: 2rem auto; padding: 2rem; background-color: #f0f2f5; border-radius: 8px; }
    .form-header { text-align: center; margin-bottom: 2rem; }
    .page-title { font-size: 2rem; font-weight: bold; color: #333; }
    .page-description { color: #777; }
    .feedback-form-card { background-color: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; font-weight: 600; color: #555; margin-bottom: 0.5rem; }
    .form-group input[type="text"], .form-group textarea, .form-group input[type="number"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; font-size: 1rem; }
    .form-group input:disabled { background-color: #f8f8f8; }
    .form-group textarea { resize: vertical; }
    .rating-stars { display: flex; align-items: center; }
    .rating-stars .star { font-size: 2rem; color: #ccc; cursor: pointer; transition: color 0.2s ease-in-out; }
    .rating-stars .star.filled { color: #f6ad55; }
    .alert { padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
    .alert-error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .alert-success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .form-actions { text-align: right; }
    .btn-primary { background-color: #007bff; color: #fff; font-weight: bold; padding: 10px 20px; border-radius: 4px; cursor: pointer; border: none; transition: background-color 0.2s ease-in-out; }
    .btn-primary:hover { background-color: #0056b3; }
  `],
})
export class FeedbackFormComponent implements OnInit {
  private apiUrl = 'https://fixflow-backend.onrender.com/api';

  feedback: Feedback = {
    calificacion: 0,
    comentario: '',
    ticket: null,
    tecnico: null
  };

  submitted: boolean = false;
  errorMessage: string = '';
  tickets: Ticket[] = [];
  tecnicos: Usuario[] = [];
  tecnicoSeleccionado: Usuario | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Usamos forkJoin para obtener ambos datos de forma eficiente y en paralelo
    forkJoin({
      tickets: this.http.get<Ticket[]>(`${this.apiUrl}/tickets/`).pipe(
        catchError(err => {
          console.error('Error al obtener los tickets:', err);
          this.errorMessage = 'No se pudieron cargar los tickets. Inténtalo de nuevo más tarde.';
          return of([]);
        })
      ),
      tecnicos: this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/`).pipe(
        catchError(err => {
          console.error('Error al obtener los técnicos:', err);
          this.errorMessage = 'No se pudieron cargar los técnicos. Inténtalo de nuevo más tarde.';
          return of([]);
        })
      )
    }).subscribe(({ tickets, tecnicos }) => {
      this.tickets = tickets;
      // Filtra solo los usuarios que tienen el rol de 'tecnico'
      this.tecnicos = tecnicos.filter(user => user.rol === 'tecnico');
    });
  }

  // Maneja el cambio de selección del ticket por su ID
  onTicketIdChange(): void {
    const ticketId = this.feedback.ticket;
    if (ticketId) {
      const selectedTicket = this.tickets.find(t => t.id === Number(ticketId));
      if (selectedTicket) {
        // Busca el técnico por el ID asignado en el ticket
        this.tecnicoSeleccionado = this.tecnicos.find(t => t.id === selectedTicket.tecnico_asignado) || null;
        this.feedback.tecnico = this.tecnicoSeleccionado?.id || null;
      } else {
        this.tecnicoSeleccionado = null;
        this.feedback.tecnico = null;
      }
    } else {
      this.tecnicoSeleccionado = null;
      this.feedback.tecnico = null;
    }
  }

  // Método para manejar el envío del formulario
  submitFeedback(): void {
    this.submitted = false;
    this.errorMessage = '';

    if (!this.feedback.calificacion || !this.feedback.comentario || !this.feedback.ticket || !this.feedback.tecnico) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    const feedbackData = {
      calificacion: this.feedback.calificacion,
      comentario: this.feedback.comentario,
      ticket: this.feedback.ticket,
      tecnico: this.feedback.tecnico
    };

    this.http.post(`${this.apiUrl}/satisfaccion/`, feedbackData).subscribe({
      next: (response) => {
        console.log('Comentario enviado:', response);
        this.submitted = true;
        this.feedback = { calificacion: 0, comentario: '', ticket: null, tecnico: null };
        this.tecnicoSeleccionado = null;
      },
      error: (err) => {
        console.error('Error al enviar el comentario:', err);
        this.errorMessage = 'Ocurrió un error al enviar tu comentario. Inténtalo de nuevo.';
      }
    });
  }

  // Para manejar el cambio de calificación por estrellas
  setRating(stars: number): void {
    this.feedback.calificacion = stars;
  }
}
