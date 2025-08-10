// src/app/satisfaction/satisfaction.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs'; // Importamos forkJoin para manejar múltiples peticiones

// Interfaz para la estructura de los datos de la API de satisfacción
interface SatisfactionFeedback {
  id: number;
  calificacion: number;
  comentario: string;
  fecha: string;
  ticket: number;
  tecnico: number;
}

// Interfaz para la estructura de los datos de la API de usuarios
interface Usuario {
  id: number;
  nombre: string;
  // Otros campos del usuario, si los hay
}

@Component({
  selector: 'app-satisfaction',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DatePipe],
  template: `
    <!-- src/app/satisfaction/satisfaction.component.html -->
    <div class="satisfaction-wrapper">
      <div class="main-content">
        <header class="satisfaction-header">
          <h1 class="section-title">¡Satisfacción del Cliente!</h1>
          <p class="description-message">Aquí puedes ver las métricas clave y los comentarios recientes de tus clientes.</p>
        </header>

        <section class="satisfaction-metrics-grid">
          <div class="metric-card">
            <div class="card-header">
              <div class="metric-icon-wrapper">
                <span class="material-icons metric-icon">sentiment_very_satisfied</span>
              </div>
              <h3 class="metric-title">Puntuación Promedio</h3>
            </div>
            <div class="metric-value-container">
              <span class="metric-value">{{ averageScore | number:'1.1-1' }} / 5</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="card-header">
              <div class="metric-icon-wrapper">
                <span class="material-icons metric-icon">comment</span>
              </div>
              <h3 class="metric-title">Comentarios Totales</h3>
            </div>
            <div class="metric-value-container">
              <span class="metric-value">{{ totalComments }}</span>
            </div>
          </div>

          <div class="metric-card">
            <div class="card-header">
              <div class="metric-icon-wrapper">
                <span class="material-icons metric-icon">person</span>
              </div>
              <h3 class="metric-title">Comentarios por Técnico</h3>
            </div>
            <div class="breakdown-list-container">
              <div *ngFor="let tech of technicianBreakdown.labels; let i = index" class="breakdown-item">
                <span class="label">{{ tech }}:</span>
                <span class="value">{{ technicianBreakdown.data[i] }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="sentiment-breakdown-card">
          <h2 class="chart-title">Desglose por Calificación</h2>
          <div class="breakdown-list-container">
            <div *ngFor="let count of calificationBreakdown; let i = index" class="breakdown-item">
              <span class="label">{{ i + 1 }} Estrella<ng-container *ngIf="count !== 1">s</ng-container>:</span>
              <span class="value">{{ count }}</span>
            </div>
          </div>
        </section>

        <section class="feedback-section">
          <h2 class="card-section-title">Últimos Comentarios Recibidos</h2>
          <ul class="feedback-list" *ngIf="feedbackList.length > 0; else noComments">
            <li class="feedback-item" *ngFor="let feedback of feedbackList">
              <p class="feedback-rating">
                <span *ngFor="let star of [1, 2, 3, 4, 5]"
                      [ngClass]="{'filled': star <= feedback.calificacion}">
                  ★
                </span>
              </p>
              <p class="feedback-comment">"{{ feedback.comentario }}"</p>
              <div class="feedback-meta">
                <span class="feedback-customer">Ticket #{{ feedback.ticket }}</span>
                <span class="feedback-date">{{ feedback.fecha | date:'dd/MM/yyyy' }}</span>
              </div>
            </li>
          </ul>
          <ng-template #noComments>
            <p class="no-comments-message">No hay comentarios de satisfacción para mostrar.</p>
          </ng-template>
        </section>
      </div>
    </div>
  `,
  styles: [`
    /* src/app/satisfaction/satisfaction.component.scss */
    .satisfaction-wrapper {
      font-family: 'Inter', sans-serif;
      background-color: transparent;
      min-height: 100vh;
      padding: 2rem;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .satisfaction-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .description-message {
      color: black;
      font-size: 1.1rem;
    }

    .satisfaction-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background-color: #fff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .metric-icon-wrapper {
      background-color: #f2f2f2;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin-bottom: 1rem;
    }

    .metric-icon {
      font-size: 2.5rem;
      color: #006D77;
    }

    .metric-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #555;
      margin-bottom: 1rem;
    }

    .metric-value-container {
      margin-top: 1rem;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .metric-value {
      font-size: 3rem;
      font-weight: bold;
      color: #333;
    }

    .sentiment-breakdown-card {
      background-color: #fff;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .breakdown-list-container {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0 1rem;
      width: 100%;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }

    .breakdown-item:last-child {
      border-bottom: none;
    }

    .breakdown-item .label {
      font-weight: 600;
      font-size: 1.1rem;
      color: #555;
    }

    .breakdown-item .value {
      font-weight: bold;
      font-size: 1.2rem;
      color: #333;
    }

    .chart-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .feedback-section {
      background-color: #fff;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .card-section-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .feedback-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .feedback-item {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    .feedback-item:last-child {
      border-bottom: none;
    }

    .feedback-rating {
      font-size: 1.2rem;
      color: #ccc;
      margin-bottom: 0.5rem;
    }

    .feedback-rating .filled {
      color: #F4A300;
    }

    .feedback-comment {
      font-style: italic;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .feedback-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: #999;
    }

    .no-comments-message {
      text-align: center;
      color: #999;
      font-style: italic;
      padding: 2rem;
    }
  `]
})
export class SatisfactionComponent implements OnInit {

  feedbackList: SatisfactionFeedback[] = [];
  userList: Usuario[] = [];
  averageScore: number = 0;
  totalComments: number = 0;
  calificationBreakdown: number[] = [0, 0, 0, 0, 0];
  technicianBreakdown: { labels: string[], data: number[] } = { labels: [], data: [] };

  private satisfactionApiUrl = 'https://fixflow-backend.onrender.com/api/satisfaccion/';
  private usersApiUrl = 'https://fixflow-backend.onrender.com/api/usuarios/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    // Usamos forkJoin para esperar que ambas peticiones de la API se completen
    forkJoin({
      satisfaction: this.http.get<SatisfactionFeedback[]>(this.satisfactionApiUrl),
      users: this.http.get<Usuario[]>(this.usersApiUrl)
    }).subscribe({
      next: (results) => {
        this.feedbackList = results.satisfaction;
        this.userList = results.users;
        this.calculateMetrics();
      },
      error: (err) => {
        console.error('Error al obtener los datos:', err);
      }
    });
  }

  calculateMetrics(): void {
    if (this.feedbackList.length > 0) {
      // Calcular puntuación promedio
      const totalScore = this.feedbackList.reduce((sum, item) => sum + item.calificacion, 0);
      this.averageScore = Math.round((totalScore / this.feedbackList.length) * 10) / 10;

      // Calcular comentarios totales
      this.totalComments = this.feedbackList.length;

      // Calcular desglose de calificaciones
      const counts = [0, 0, 0, 0, 0];
      this.feedbackList.forEach(item => {
        if (item.calificacion >= 1 && item.calificacion <= 5) {
          counts[item.calificacion - 1]++;
        }
      });
      this.calificationBreakdown = counts;

      // Calcular desglose por técnico y reemplazar ID por nombre
      const technicianCounts = new Map<number, number>();
      this.feedbackList.forEach(item => {
        technicianCounts.set(item.tecnico, (technicianCounts.get(item.tecnico) || 0) + 1);
      });

      const userMap = new Map<number, string>();
      this.userList.forEach(user => userMap.set(user.id, user.nombre));

      this.technicianBreakdown = {
        labels: Array.from(technicianCounts.keys()).map(id => userMap.get(id) || `Técnico ${id}`),
        data: Array.from(technicianCounts.values())
      };
    }
  }
}
