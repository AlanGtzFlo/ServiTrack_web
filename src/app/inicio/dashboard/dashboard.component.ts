import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { AuthService } from '../../auth.service';

// Interfaz para la API de estados por usuario
interface TicketsByTechnicianResponse {
  cerrado: number;
  completado: number;
  en_proceso: number;
  pendiente: number;
  total: number;
}

const COLORS = {
  successGreen: '#3CB371',
  blueChart: '#4A90E2',
  yellowOrange: '#F4A300',
  softRed: '#E74C3C',
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  userName: string = 'Compañero';
  userMatricula: string = 'N/A';
  userImage: string = 'URL_A_IMAGEN_POR_DEFECTO';
  ticketsToResolve: number = 0;
  isAdmin: boolean = false;

  ticketsByTechnicianData: TicketsByTechnicianResponse = {
    cerrado: 0, completado: 0, en_proceso: 0, pendiente: 0, total: 0
  };

  @ViewChild('ticketsByTechnicianChart') ticketsByTechnicianChartRef!: ElementRef<HTMLCanvasElement>;
  ticketsByTechnicianChart: Chart | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserInfo();

    // Nos suscribimos al rol del usuario para actualizar el estado y cargar datos.
    // Esto asegura que la interfaz se actualice en cuanto el rol esté disponible.
    this.authService.userRole$.subscribe(role => {
        this.isAdmin = role === 'admin';
        // Solo cargar los tickets y crear el gráfico si el usuario no es admin.
        if (!this.isAdmin) {
          this.fetchTicketsToResolve();
        } else {
          // Destruir el gráfico si existe, en caso de que el rol cambie a admin.
          if (this.ticketsByTechnicianChart) {
            this.ticketsByTechnicianChart.destroy();
            this.ticketsByTechnicianChart = null;
          }
        }
    });
  }

  // ngAfterViewInit ya no es necesario para crear el gráfico, ya que la lógica
  // ahora está en la suscripción del rol.
  ngAfterViewInit(): void { }

  loadUserInfo(): void {
    const userDataString = localStorage.getItem('user_data');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData.user) {
          if (userData.user.nombre) {
            this.userName = userData.user.nombre;
          }
          if (userData.user.rol) {
            this.userMatricula = userData.user.rol;
          }
          if (userData.user.foto) {
            this.userImage = userData.user.foto;
          }
        }
      } catch (e) {
        console.error('Error al parsear user_data de localStorage:', e);
        localStorage.removeItem('user_data');
      }
    }
  }

  fetchTicketsToResolve(): void {
    const ticketsByTechnicianApiUrl = 'https://fixflow-backend.onrender.com/api/tickets/contar_estados_por_usuario/';
    this.http.get<TicketsByTechnicianResponse>(ticketsByTechnicianApiUrl).pipe(
      catchError(error => {
        console.error('Error fetching tickets by technician data:', error);
        return of({ cerrado: 0, completado: 0, en_proceso: 0, pendiente: 0, total: 0 });
      })
    ).subscribe(data => {
      this.ticketsByTechnicianData = data;
      this.ticketsToResolve = data.pendiente + data.en_proceso;
      // La creación del gráfico se realiza aquí, después de que los datos están disponibles
      this.createTicketsByTechnicianChart();
    });
  }

  createTicketsByTechnicianChart(): void {
    if (this.ticketsByTechnicianChart) {
      this.ticketsByTechnicianChart.destroy();
    }
    // Añadir una comprobación para asegurar que el gráfico solo se crea si el elemento existe
    if (!this.ticketsByTechnicianChartRef) return;
    const ctx = this.ticketsByTechnicianChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const dataLabels = ['Cerrado', 'Completado', 'En Proceso', 'Pendiente'];
    const dataValues = [
      this.ticketsByTechnicianData.cerrado,
      this.ticketsByTechnicianData.completado,
      this.ticketsByTechnicianData.en_proceso,
      this.ticketsByTechnicianData.pendiente,
    ];

    this.ticketsByTechnicianChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: dataLabels,
        datasets: [{
          label: 'Tickets',
          data: dataValues,
          backgroundColor: [
            COLORS.successGreen,
            COLORS.blueChart,
            COLORS.yellowOrange,
            COLORS.softRed,
          ],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            align: 'start',
            labels: {
              usePointStyle: true,
              font: {
                size: 14 // Aumenta el tamaño de la fuente de la leyenda
              }
            }
          },
          title: {
            display: true,
            text: 'Estados de Tickets',
            font: {
              size: 16 // Aumenta el tamaño de la fuente del título
            }
          },
        },
      },
    });
  }

  viewTickets(): void {
    console.log('Navegando a la sección de tickets...');
    this.router.navigate(['/services']);
  }

  openNewServiceForm(): void {
    console.log('Abriendo formulario para nuevo servicio...');
  }
}
