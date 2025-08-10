// src/app/reports/reports.component.ts
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // ¡Importación corregida! Se ha añadido RouterModule
import Chart from 'chart.js/auto'; // Importa Chart.js

// Definición de colores para Chart.js
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
  // Colores adicionales para las gráficas si es necesario
  blueChart: '#007BFF',
  greenChart: '#28A745',
  orangeChart: '#FFC107',
  redChart: '#DC3545',
  lightBlue: '#ADD8E6',
  lightGreen: '#90EE90',
  lightOrange: '#FFD700',
  lightRed: '#FFA07A',
};

@Component({
  selector: 'app-reports',
  standalone: true,
  // La clave es añadir RouterModule aquí para que 'router-outlet' sea reconocido
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, AfterViewInit {
  selectedReportType: 'overview' | 'servicesByStatus' | 'servicesByTechnician' | 'clientsOverview' = 'overview';

  // Datos para Reporte de Visión General
  overviewStats = {
    totalServices: 1250,
    openServices: 180,
    closedServices: 1070,
    averageResolutionTime: '2.5 días',
    topTechnician: 'Carlos Ruiz',
    newClientsLastMonth: 15,
    totalClientsRegistered: 250
  };

  // Datos para Resumen de Clientes
  clientsOverviewStats = {
    totalClients: 250,
    activeClients: 180,
    vipClients: 25,
    averageServicesPerClient: '4.2',
    mainIndustries: [
      { name: 'Manufactura', count: 80 },
      { name: 'Logística', count: 60 },
      { name: 'Retail', count: 50 },
      { name: 'Construcción', count: 30 },
      { name: 'Servicios', count: 30 }
    ]
  };

  // Referencias a los elementos canvas en el HTML
  @ViewChild('servicesStatusChart') servicesStatusChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('technicianPerformanceChart') technicianPerformanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('totalServicesChart') totalServicesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('openServicesChart') openServicesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('closedServicesChart') closedServicesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('newClientsChart') newClientsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('activeClientsChart') activeClientsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('vipClientsChart') vipClientsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('industriesChart') industriesChartRef!: ElementRef<HTMLCanvasElement>;

  // Instancias de Chart.js
  servicesStatusChart: Chart | null = null;
  technicianPerformanceChart: Chart | null = null;
  totalServicesChart: Chart | null = null;
  openServicesChart: Chart | null = null;
  closedServicesChart: Chart | null = null;
  newClientsChart: Chart | null = null;
  activeClientsChart: Chart | null = null;
  vipClientsChart: Chart | null = null;
  industriesChart: Chart | null = null;

  // Inyecta el servicio Router en el constructor
  constructor(public router: Router) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  // Método para (re)renderizar los gráficos cuando cambia el tipo de reporte
  renderCharts(): void {
    // Destruir todos los gráficos existentes para evitar duplicados y problemas de memoria
    this.destroyCharts();

    // Renderizar gráficos según el tipo de reporte seleccionado
    if (this.selectedReportType === 'overview') {
      this.createTotalServicesChart();
      this.createOpenServicesChart();
      this.createClosedServicesChart();
      this.createNewClientsChart();
    } else if (this.selectedReportType === 'servicesByStatus') {
      this.createServicesStatusChart();
    } else if (this.selectedReportType === 'servicesByTechnician') {
      this.createTechnicianPerformanceChart();
    } else if (this.selectedReportType === 'clientsOverview') {
      this.createActiveClientsChart();
      this.createVipClientsChart();
      this.createIndustriesChart();
    }
  }

  // Destruye todas las instancias de Chart.js
  destroyCharts(): void {
    if (this.servicesStatusChart) { this.servicesStatusChart.destroy(); this.servicesStatusChart = null; }
    if (this.technicianPerformanceChart) { this.technicianPerformanceChart.destroy(); this.technicianPerformanceChart = null; }
    if (this.totalServicesChart) { this.totalServicesChart.destroy(); this.totalServicesChart = null; }
    if (this.openServicesChart) { this.openServicesChart.destroy(); this.openServicesChart = null; }
    if (this.closedServicesChart) { this.closedServicesChart.destroy(); this.closedServicesChart = null; }
    if (this.newClientsChart) { this.newClientsChart.destroy(); this.newClientsChart = null; }
    if (this.activeClientsChart) { this.activeClientsChart.destroy(); this.activeClientsChart = null; }
    if (this.vipClientsChart) { this.vipClientsChart.destroy(); this.vipClientsChart = null; }
    if (this.industriesChart) { this.industriesChart.destroy(); this.industriesChart = null; }
  }


  // --- Gráficas para Visión General (Overview) ---

  createTotalServicesChart(): void {
    if (!this.totalServicesChartRef) return;
    const ctx = this.totalServicesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.totalServicesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total'],
        datasets: [{
          label: 'Servicios',
          data: [this.overviewStats.totalServices],
          backgroundColor: COLORS.darkBlue,
          borderColor: COLORS.darkBlue,
          borderWidth: 1,
          borderRadius: 5, // Bordes redondeados para la barra
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Barra horizontal
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.x} Servicios`
            }
          }
        },
        scales: {
          x: { display: false, beginAtZero: true, grid: { display: false } },
          y: { display: false, grid: { display: false } }
        }
      }
    });
  }

  createOpenServicesChart(): void {
    if (!this.openServicesChartRef) return;
    const ctx = this.openServicesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.openServicesChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Abiertos', 'Cerrados'],
        datasets: [{
          data: [this.overviewStats.openServices, this.overviewStats.closedServices],
          backgroundColor: [COLORS.yellowOrange, COLORS.lightGray],
          borderColor: [COLORS.yellowOrange, COLORS.lightGray],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });
  }

  createClosedServicesChart(): void {
    if (!this.closedServicesChartRef) return;
    const ctx = this.closedServicesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.closedServicesChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cerrados', 'Abiertos'],
        datasets: [{
          data: [this.overviewStats.closedServices, this.overviewStats.openServices],
          backgroundColor: [COLORS.successGreen, COLORS.lightGray],
          borderColor: [COLORS.successGreen, COLORS.lightGray],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });
  }

  createNewClientsChart(): void {
    if (!this.newClientsChartRef) return;
    const ctx = this.newClientsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.newClientsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Nuevos Clientes'],
        datasets: [{
          label: 'Clientes',
          data: [this.overviewStats.newClientsLastMonth],
          backgroundColor: COLORS.teal,
          borderColor: COLORS.teal,
          borderWidth: 1,
          borderRadius: 5,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.x} Clientes`
            }
          }
        },
        scales: {
          x: { display: false, beginAtZero: true, grid: { display: false } },
          y: { display: false, grid: { display: false } }
        }
      }
    });
  }

  // --- Gráficas para Servicios por Estado (ya existente) ---
  createServicesStatusChart(): void {
    if (!this.servicesStatusChartRef) return;
    const ctx = this.servicesStatusChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.servicesStatusChart = new Chart(this.servicesStatusChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Pendiente', 'Asignado', 'En Proceso', 'Concluido', 'Cerrado', 'Cancelado'],
        datasets: [{
          data: [50, 30, 40, 80, 70, 10], // Valores simulados
          backgroundColor: [
            COLORS.orangeChart, // Pendiente (Amarillo)
            COLORS.greenChart, // Asignado (Verde)
            COLORS.blueChart, // En Proceso (Azul)
            COLORS.mediumGray, // Concluido (Gris - para distinguirlo de Cerrado que es éxito final)
            COLORS.successGreen, // Cerrado (Verde agua - éxito final)
            COLORS.softRed // Cancelado (Rojo)
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Servicios por Estado'
          }
        }
      }
    });
  }

  // --- Gráficas para Rendimiento de Técnicos (ya existente) ---
  createTechnicianPerformanceChart(): void {
    if (!this.technicianPerformanceChartRef) return;
    const ctx = this.technicianPerformanceChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.technicianPerformanceChart = new Chart(this.technicianPerformanceChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Carlos Ruiz', 'Ana García', 'Miguel Soto', 'Juan Pérez', 'Laura G.'],
        datasets: [{
          label: 'Servicios Completados',
          data: [45, 30, 20, 18, 12], // Valores simulados
          backgroundColor: COLORS.blueChart, // Azul
          borderColor: COLORS.blueChart,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Servicios Completados por Técnico'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad de Servicios'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Técnico'
            }
          }
        }
      }
    });
  }

  // --- Gráficas para Resumen de Clientes (Clients Overview) ---

  createActiveClientsChart(): void {
    if (!this.activeClientsChartRef) return;
    const ctx = this.activeClientsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.activeClientsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Activos', 'Inactivos'],
        datasets: [{
          data: [this.clientsOverviewStats.activeClients, this.clientsOverviewStats.totalClients - this.clientsOverviewStats.activeClients],
          backgroundColor: [COLORS.successGreen, COLORS.lightGray],
          borderColor: [COLORS.successGreen, COLORS.lightGray],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });
  }

  createVipClientsChart(): void {
    if (!this.vipClientsChartRef) return;
    const ctx = this.vipClientsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.vipClientsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['VIP', 'No VIP'],
        datasets: [{
          data: [this.clientsOverviewStats.vipClients, this.clientsOverviewStats.totalClients - this.clientsOverviewStats.vipClients],
          backgroundColor: [COLORS.yellowOrange, COLORS.lightGray],
          borderColor: [COLORS.yellowOrange, COLORS.lightGray],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}%`
            }
          }
        }
      }
    });
  }

  createIndustriesChart(): void {
    if (!this.industriesChartRef) return;
    const ctx = this.industriesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.industriesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.clientsOverviewStats.mainIndustries.map(i => i.name),
        datasets: [{
          label: 'Número de Clientes',
          data: this.clientsOverviewStats.mainIndustries.map(i => i.count),
          backgroundColor: [
            COLORS.teal,
            COLORS.blueChart,
            COLORS.orangeChart,
            COLORS.successGreen,
            COLORS.softRed
          ],
          borderColor: [
            COLORS.teal,
            COLORS.blueChart,
            COLORS.orangeChart,
            COLORS.successGreen,
            COLORS.softRed
          ],
          borderWidth: 1,
          borderRadius: 5,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Clientes por Industria Principal'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Cantidad de Clientes'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Industria'
            }
          }
        }
      }
    });
  }

  // Método para manejar el cambio de tipo de reporte
  onReportTypeChange(): void {
    this.renderCharts(); // Vuelve a renderizar los gráficos al cambiar la selección
  }

  // Simulación de descarga de reporte
  downloadReport(): void {
    // Reemplaza alert con un mensaje en la UI o un modal
    console.log(`Descargando reporte de tipo: ${this.selectedReportType} (simulado).`);
    // En un caso real, aquí harías una llamada a una API para generar y descargar un PDF/CSV.
  }
}
