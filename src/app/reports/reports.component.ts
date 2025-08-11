import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { AuthService } from '../auth.service';

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

// Nueva interfaz para la respuesta de la API de tickets por técnico
interface TicketsPorTecnicoCantidadResponse {
  tecnico_pk: number;
  tecnico_nombre: string;
  tecnico_correo: string;
  total_tickets: number;
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

interface MensajeReporte {
  id: number;
  reporte: number;
  mensaje: string;
  imagen: string | null;
  fecha: string;
  reporteDescripcion?: string;
}

interface Reporte {
  id: number;
  descripcion: string;
  tecnico: number;
  ticket: number;
  ubicacion: number;
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

  // ticketsPorTecnicoData ahora es una lista de la nueva interfaz
  ticketsPorTecnicoData: TicketsPorTecnicoCantidadResponse[] | null = null;
  allReports: any[] = [];
  reportMessages: MensajeReporte[] = [];

  @ViewChild('overviewChart') overviewChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ticketsByTechnicianChart') ticketsByTechnicianChartRef!: ElementRef<HTMLCanvasElement>;

  overviewChart: Chart | null = null;
  ticketsByTechnicianChart: Chart | null = null;

  isAdmin: boolean = false;
  currentUserId: number | null = null;

  constructor(public router: Router, private http: HttpClient, private authService: AuthService) {
    this.authService.userRole$.subscribe(role => {
      this.isAdmin = role === 'admin';
    });
    this.authService.currentUserId$.subscribe(id => {
      this.currentUserId = id;
    });
  }

  ngOnInit(): void {
    if (!this.isAdmin) {
      this.selectedReportType = 'overview';
    }
    this.fetchDataForReport();
  }

  ngAfterViewInit(): void {
    // La llamada a renderCharts aquí es para el caso inicial de 'overview'
    // o el caso de usuario no admin.
    if (this.selectedReportType === 'overview' && this.isAdmin) {
      this.createOverviewChart();
    } else if (!this.isAdmin) {
      // Lógica para usuarios no administradores si es necesario.
    }
  }

  fetchDataForReport(): void {
    this.destroyCharts();
    if (this.isAdmin && this.selectedReportType === 'overview') {
      this.fetchOverviewData();
    } else if (this.isAdmin && this.selectedReportType === 'ticketsByTechnician') {
      this.fetchTicketsByTechnicianData();
    } else {
      this.fetchUserReports();
    }
  }

  fetchUserReports(): void {
    forkJoin({
      reports: this.http.get<Reporte[]>(this.allReportsApiUrl).pipe(
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
    }).subscribe(({ reports, tickets, usuarios, ubicaciones, messages }) => {
      let filteredReports: Reporte[] = [];
      if (this.currentUserId !== null) {
        filteredReports = reports.filter(report => report.tecnico === this.currentUserId);
      }
      this.allReports = filteredReports.map(report => {
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
     
      const filteredReportIds = filteredReports.map(report => report.id);

      this.reportMessages = messages
        .filter(message => filteredReportIds.includes(message.reporte))
        .map(message => {
          const report = filteredReports.find(r => r.id === message.reporte);
          return {
            ...message,
            reporteDescripcion: report ? report.descripcion : 'Reporte Desconocido'
          };
        });
      this.renderCharts();
    });
  }

  fetchOverviewData(): void {
    forkJoin({
      estados: this.http.get<ContarEstadosTotalesResponse>(this.contarEstadosTotalesApiUrl).pipe(
        catchError(() => of({ en_proceso: 0, pendiente: 0, cerrado: 0, completado: 0 }))
      ),
      reports: this.http.get<Reporte[]>(this.allReportsApiUrl).pipe(
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
      this.allReports = reports.map(report => {
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
      const allReportIds = reports.map(report => report.id);
      this.reportMessages = messages
        .filter(message => allReportIds.includes(message.reporte))
        .map(message => {
          const report = reports.find(r => r.id === message.reporte);
          return {
            ...message,
            reporteDescripcion: report ? report.descripcion : 'Reporte Desconocido'
          };
        });
      // Aseguramos que la gráfica se dibuje solo si la selección lo requiere
      if (this.selectedReportType === 'overview') {
        this.renderCharts();
      }
    });
  }

  fetchTicketsByTechnicianData(): void {
    this.http.get<TicketsPorTecnicoCantidadResponse[]>(this.ticketsPorTecnicoApiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener datos de tickets por técnico:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.ticketsPorTecnicoData = data;
     
      // Uso de setTimeout para permitir que Angular actualice el DOM
      // antes de intentar crear la gráfica.
      setTimeout(() => {
        this.renderCharts();
      }, 0);
    });
  }

  onReportTypeChange(): void {
    this.fetchDataForReport();
  }

  renderCharts(): void {
    this.destroyCharts();
    if (this.isAdmin) {
      switch (this.selectedReportType) {
        case 'overview':
          this.createOverviewChart();
          break;
        case 'ticketsByTechnician':
          this.createTicketsByTechnicianChart();
          break;
      }
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
 
    // Obtener las etiquetas (nombres de los técnicos) y los datos (total de tickets)
    // de la nueva estructura de la API.
    const technicianNames = this.ticketsPorTecnicoData.map(t => t.tecnico_nombre);
    const ticketCounts = this.ticketsPorTecnicoData.map(t => t.total_tickets);
 
    this.ticketsByTechnicianChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: technicianNames,
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
