import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
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
  purpleChart: '#8A2BE2'
};

interface ContarEstadosTotalesResponse {
  en_proceso: number;
  pendiente: number;
  cerrado: number;
  completado: number;
}

interface TicketsPorTecnicoCantidadResponse {
  [tecnicoId: string]: number;
}

interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
}

interface Ubicacion {
  id: number;
  nombre: string;
}

// Nueva interfaz para los mensajes de reporte
interface MensajeReporte {
  id: number;
  reporte: number; // Este es el ID del reporte
  mensaje: string;
  imagen: string | null;
  fecha: string;
  reporteDescripcion?: string; // Propiedad para el mapeo
}

// Nueva interfaz para la API de reportes
interface Reporte {
  id: number;
  descripcion: string;
  // ... otros campos del reporte
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

  // Endpoints de la API
  private ticketsPorTecnicoApiUrl = 'https://fixflow-backend.onrender.com/api/tickets/conteo_tickets_por_tecnico/';
  private contarEstadosTotalesApiUrl = 'https://fixflow-backend.onrender.com/api/tickets/contar_estados_totales/';
  private allReportsApiUrl = 'https://fixflow-backend.onrender.com/api/reportes/';
  private ticketsApiUrl = 'https://fixflow-backend.onrender.com/api/tickets/';
  private usuariosApiUrl = 'https://fixflow-backend.onrender.com/api/usuarios/';
  private ubicacionesApiUrl = 'https://fixflow-backend.onrender.com/api/ubicaciones/';
  private mensajesReporteApiUrl = 'https://fixflow-backend.onrender.com/api/mensajes_reporte/';

  overviewStats = {
    en_proceso: 0,
    pendiente: 0,
    cerrado: 0,
    completado: 0,
  };

  ticketsPorTecnicoData: TicketsPorTecnicoCantidadResponse | null = null;
  allReports: any[] = [];
  reportMessages: MensajeReporte[] = []; // Nueva propiedad

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
    forkJoin({
      estados: this.http.get<ContarEstadosTotalesResponse>(this.contarEstadosTotalesApiUrl).pipe(
        catchError(() => of({ en_proceso: 0, pendiente: 0, cerrado: 0, completado: 0 }))
      ),
      reports: this.http.get<any[]>(this.allReportsApiUrl).pipe(
        catchError(() => of([]))
      ),
      tickets: this.http.get<Ticket[]>(this.ticketsApiUrl).pipe(
        catchError(() => of([]))
      ),
      usuarios: this.http.get<Usuario[]>(this.usuariosApiUrl).pipe(
        catchError(() => of([]))
      ),
      ubicaciones: this.http.get<Ubicacion[]>(this.ubicacionesApiUrl).pipe(
        catchError(() => of([]))
      ),
      messages: this.http.get<MensajeReporte[]>(this.mensajesReporteApiUrl).pipe(
        catchError(() => of([]))
      )
    }).subscribe(({ estados, reports, tickets, usuarios, ubicaciones, messages }) => {
      this.overviewStats = estados;

      // Mapear los IDs a nombres en la lista de reportes para la tabla
      const processedReports = reports.map(report => {
        const ticket = tickets.find(t => t.id === report.ticket);
        const usuario = usuarios.find(u => u.id === report.tecnico);
        const ubicacion = ubicaciones.find(u => u.id === report.ubicacion);

        return {
          ...report,
          ticket: ticket ? ticket.titulo : 'Desconocido',
          tecnico: usuario ? `${usuario.nombre} ${usuario.apellidos || ''}`.trim() : 'Desconocido',
          ubicacion: ubicacion ? ubicacion.nombre : 'Desconocido',
        };
      });

      this.allReports = processedReports;

      // Mapear el ID del reporte a su descripción para la lista de mensajes
      this.reportMessages = messages.map(message => {
        const report = reports.find(r => r.id === message.reporte);
        return {
          ...message,
          reporteDescripcion: report ? report.descripcion : 'Reporte Desconocido'
        };
      });

      this.renderCharts();
    });
  }

  fetchTicketsByTechnicianData(): void {
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

    const dataLabels = ['Pendiente', 'En Proceso', 'Cerrado', 'Completado'];
    const dataValues = [
      this.overviewStats.pendiente,
      this.overviewStats.en_proceso,
      this.overviewStats.cerrado,
      this.overviewStats.completado
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
            COLORS.successGreen,
            COLORS.purpleChart
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
