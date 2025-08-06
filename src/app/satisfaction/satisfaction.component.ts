// src/app/satisfaction/satisfaction.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto'; // Importa Chart.js

// Definición de colores para Chart.js (actualizado según styles.scss)
const COLORS = {
  yellowOrange: '#F4A300',
  teal: '#006D77',
  white: '#FFFFFF',
  darkBlue: '#003F4E',
  lightGray: '#F2F2F2', // Coincide con styles.scss
  successGreen: '#3CB371', // Coincide con styles.scss
  softRed: '#E74C3C', // Coincide con styles.scss
  mediumGray: '#757575', // Añadido de styles.scss
  darkGray: '#424242', // Añadido de styles.scss
};


@Component({
  selector: 'app-satisfaction',
  templateUrl: './satisfaction.component.html',
  styleUrls: ['./satisfaction.component.scss']
})
export class SatisfactionComponent implements OnInit, AfterViewInit {

  // Referencias a los elementos canvas en el HTML
  @ViewChild('averageScoreChart') averageScoreChartRef!: ElementRef;
  @ViewChild('totalCommentsChart') totalCommentsChartRef!: ElementRef;
  @ViewChild('positiveSatisfactionChart') positiveSatisfactionChartRef!: ElementRef;
  @ViewChild('loyalCustomersChart') loyalCustomersChartRef!: ElementRef;
  @ViewChild('sentimentBreakdownChart') sentimentBreakdownChartRef!: ElementRef;

  // Datos de ejemplo para los comentarios (se mantienen)
  feedbackList: any[] = [
    {
      rating: '★★★★★',
      comment: 'Excelente servicio, la póliza se activó muy rápido. ¡Muy satisfecho!',
      customer: 'Juan Pérez',
      date: '10/07/2025'
    },
    {
      rating: '★★★★☆',
      comment: 'El técnico llegó a tiempo y resolvió el problema. Solo un pequeño retraso en la comunicación inicial.',
      customer: 'María García',
      date: '09/07/2025'
    },
    {
      rating: '★★★☆☆',
      comment: 'El soporte telefónico fue un poco lento, pero al final se resolvió. Podría mejorar el tiempo de respuesta.',
      customer: 'Carlos López',
      date: '08/07/2025'
    }
  ];

  constructor() { }

  ngOnInit(): void { }

  // ngAfterViewInit se ejecuta después de que la vista del componente ha sido inicializada
  // y los elementos del DOM están disponibles. Es el lugar ideal para renderizar gráficas.
  ngAfterViewInit(): void {
    this.createAverageScoreChart();
    this.createTotalCommentsChart();
    this.createPositiveSatisfactionChart();
    this.createLoyalCustomersChart();
    this.createSentimentBreakdownChart();
  }

  // Gráfica de Puntuación Promedio (Doughnut Chart)
  createAverageScoreChart(): void {
    const ctx = this.averageScoreChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Puntuación Actual', 'Restante'],
        datasets: [{
          data: [4.8, 0.2], // 4.8 de 5
          backgroundColor: [
            COLORS.yellowOrange, // Color de tu variable global
            COLORS.lightGray
          ],
          borderColor: [
            COLORS.yellowOrange,
            COLORS.lightGray
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // Permite que el canvas se ajuste al tamaño de su contenedor
        cutout: '70%', // Grosor del anillo
        plugins: {
          legend: {
            display: false // No mostrar la leyenda
          },
          tooltip: {
            enabled: true, // Habilitar tooltips al pasar el ratón
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                if (label) {
                  return label + ': ' + context.parsed + ' puntos';
                }
                return '';
              }
            }
          }
        }
      }
    });
  }

  // Gráfica de Comentarios Totales (Bar Chart simple)
  createTotalCommentsChart(): void {
    const ctx = this.totalCommentsChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Comentarios'],
        datasets: [{
          label: 'Total',
          data: [1250], // Número total de comentarios
          backgroundColor: COLORS.teal,
          borderColor: COLORS.teal,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Barra horizontal
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                if (label) {
                  return label + ': ' + context.parsed.x;
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            display: false, // Ocultar etiquetas del eje X
            grid: {
              display: false // Ocultar líneas de la cuadrícula
            }
          },
          y: {
            display: false, // Ocultar etiquetas del eje Y
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  // Gráfica de Satisfacción Positiva (Doughnut Chart)
  createPositiveSatisfactionChart(): void {
    const ctx = this.positiveSatisfactionChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positivo', 'Negativo/Neutral'],
        datasets: [{
          data: [92, 8], // 92% positivo, 8% restante
          backgroundColor: [
            COLORS.successGreen,
            COLORS.softRed
          ],
          borderColor: [
            COLORS.successGreen,
            COLORS.softRed
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                if (label) {
                  return label + ': ' + context.parsed + '%';
                }
                return '';
              }
            }
          }
        }
      }
    });
  }

  // Gráfica de Clientes Fieles (Doughnut Chart)
  createLoyalCustomersChart(): void {
    const ctx = this.loyalCustomersChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Fieles', 'Nuevos/No Fieles'],
        datasets: [{
          data: [75, 25], // 75% fieles, 25% restantes
          backgroundColor: [
            COLORS.teal,
            COLORS.lightGray
          ],
          borderColor: [
            COLORS.teal,
            COLORS.lightGray
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                if (label) {
                  return label + ': ' + context.parsed + '%';
                }
                return '';
              }
            }
          }
        }
      }
    });
  }

  // Gráfica de Desglose de Sentimiento (Bar Chart)
  createSentimentBreakdownChart(): void {
    const ctx = this.sentimentBreakdownChartRef.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Muy Satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho', 'Muy Insatisfecho'],
        datasets: [{
          label: 'Número de Comentarios',
          data: [400, 600, 150, 70, 30], // Datos de ejemplo
          backgroundColor: [
            COLORS.successGreen,
            COLORS.teal, // Usando teal para 'Satisfecho'
            COLORS.yellowOrange,
            COLORS.softRed,
            '#8B0000' // Un rojo más oscuro para 'Muy Insatisfecho'
          ],
          borderColor: [
            COLORS.successGreen,
            COLORS.teal,
            COLORS.yellowOrange,
            COLORS.softRed,
            '#8B0000'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // <-- CAMBIO REALIZADO AQUÍ
        plugins: {
          legend: {
            display: false // No mostrar leyenda para barras individuales
          }
        },
        scales: {
          x: {
            grid: {
              display: false // Ocultar líneas de la cuadrícula en el eje X
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false // Ocultar líneas de la cuadrícula en el eje Y
            }
          }
        }
      }
    });
  }

  loadMoreFeedback(): void {
    console.log('Cargando más comentarios...');
  }
}
