import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';

const COLORS = {
  yellowOrange: '#F4A300',
  teal: '#006D77',
  white: '#FFFFFF',
  darkBlue: '#003F4E',
  lightGray: '#F2F2F2',
  successGreen: '#3CB371',
  softRed: '#E74C3C',
  mediumGray: '#757575',
  darkGray: '#424242',
  blueChart: '#007BFF',
  greenChart: '#28A745',
  orangeChart: '#FFC107',
  redChart: '#DC3545',
};

// Interfaz para el conteo de estados de tickets totales
interface ContarEstadosTotalesResponse {
  en_proceso: number;
  pendiente: number;
  cerrado: number;
}

// Interfaz para la respuesta de tickets por técnico por cantidad
// (Adaptada a la estructura {"id_tecnico": cantidad_tickets})
interface TicketsPorTecnicoCantidadResponse {
    [tecnicoId: string]: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  selectedReportType: 'overview' | 'ticketsByTechnician' = 'overview';
  
  private contarEstadosTotalesApiUrl = 'https://fixflow-backend.onrender.com/api/tickets/contar_estados_totales/';
  // El endpoint correcto que devuelve el conteo total de tickets por técnico
  private ticketsPorTecnicoApiUrl = 'https://fixflow-backend.onrender.com/api/tickets/por_tecnico/'; 
  
  overviewStats = {
    en_proceso: 0,
    pendiente: 0,
    cerrado: 0,
  };

  ticketsPorTecnicoData: TicketsPorTecnicoCantidadResponse | null = null;
  
  @ViewChild('overviewChart') overviewChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ticketsByTechnicianChart') ticketsByTechnicianChartRef!: ElementRef<HTMLCanvasElement>;

  overviewChart: Chart | null = null;
  ticketsByTechnicianChart: Chart | null = null;

  constructor(public router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchDataForReport();
  }

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  fetchDataForReport(): void {
    this.destroyCharts();
    switch (this.selectedReportType) {
      case 'overview':
        this.fetchOverviewData();
        break;
      case 'ticketsByTechnician':
        this.fetchTicketsByTechnicianData();
        break;
    }
  }

  fetchOverviewData(): void {
    this.http.get<ContarEstadosTotalesResponse>(this.contarEstadosTotalesApiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener datos de estados totales:', error);
        return of({ en_proceso: 0, pendiente: 0, cerrado: 0 });
      })
    ).subscribe(data => {
      this.overviewStats = data;
      this.renderCharts();
    });
  }

  fetchTicketsByTechnicianData(): void {
    // Se utiliza el endpoint correcto que devuelve el conteo total de tickets por técnico
    this.http.get<TicketsPorTecnicoCantidadResponse>(this.ticketsPorTecnicoApiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener datos de tickets por técnico:', error);
        return of({});
      })
    ).subscribe(data => {
      this.ticketsPorTecnicoData = data;
      this.renderCharts();
    });
  }

  onReportTypeChange(): void {
    this.fetchDataForReport();
  }

  renderCharts(): void {
    this.destroyCharts();
    switch (this.selectedReportType) {
      case 'overview':
        this.createOverviewChart();
        break;
      case 'ticketsByTechnician':
        this.createTicketsByTechnicianChart();
        break;
    }
  }

  destroyCharts(): void {
    if (this.overviewChart) this.overviewChart.destroy();
    if (this.ticketsByTechnicianChart) this.ticketsByTechnicianChart.destroy();
  }

  createOverviewChart(): void {
    if (!this.overviewChartRef) return;
    const ctx = this.overviewChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const dataLabels = ['Pendiente', 'En Proceso', 'Cerrado'];
    const dataValues = [
      this.overviewStats.pendiente,
      this.overviewStats.en_proceso,
      this.overviewStats.cerrado
    ];
    
    this.overviewChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: dataLabels,
        datasets: [{
          label: 'Tickets',
          data: dataValues,
          backgroundColor: [
            COLORS.yellowOrange,
            COLORS.blueChart,
            COLORS.successGreen
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            align: 'center',
            labels: {
              usePointStyle: true
            }
          },
          title: {
            display: true,
            text: 'Resumen General de Tickets por Estado'
          }
        }
      }
    });
  }

  createTicketsByTechnicianChart(): void {
    if (!this.ticketsByTechnicianChartRef || !this.ticketsPorTecnicoData) return;
    const ctx = this.ticketsByTechnicianChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Obtener los IDs de los técnicos y sus conteos de tickets
    const technicianIds = Object.keys(this.ticketsPorTecnicoData);
    const ticketCounts = Object.values(this.ticketsPorTecnicoData);
    
    this.ticketsByTechnicianChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: technicianIds.map(id => `Técnico ${id}`),
        datasets: [
          {
            label: 'Cantidad Total de Tickets',
            data: ticketCounts,
            backgroundColor: COLORS.blueChart,
            borderColor: COLORS.darkBlue,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { 
            beginAtZero: true,
            title: { display: true, text: 'Cantidad de Tickets' }
          },
          x: { 
            title: { display: true, text: 'Técnico' }
          }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Cantidad de Tickets por Técnico'
          }
        }
      }
    });
  }

  downloadReport(): void {
    console.log(`Descargando reporte de tipo: ${this.selectedReportType}`);
  }
}