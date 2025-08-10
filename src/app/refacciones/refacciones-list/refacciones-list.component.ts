import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/**
 * @interface RefaccionApi
 * Define la estructura de los datos tal como vienen de tu API.
 */
interface RefaccionApi {
  id: number;
  nombre: string;
  descripcion: string;
  codigo: string;
  fabricante: string;
  vida_util_estimada: string;
  imagen: string; // La URL de la imagen de la refacción
  estatus: boolean; // El estatus viene como un booleano
}

@Component({
  selector: 'app-refacciones-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './refacciones-list.component.html',
  styleUrls: ['./refacciones-list.component.scss']
})
export class RefaccionesListComponent implements OnInit {
  refacciones: RefaccionApi[] = [];
  isLoading = true;
  error: string | null = null;
  searchTerm: string = ''; // Propiedad para el término de búsqueda

  private apiUrl = 'https://fixflow-backend.onrender.com/api/refacciones/';
  private exportPdfUrl = 'https://fixflow-backend.onrender.com/api/refacciones/exportar_refacciones/';
  private cloudinaryBaseUrl = 'http://res.cloudinary.com/dfdcovbqs/';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchRefacciones();
  }

  fetchRefacciones(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<RefaccionApi[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.refacciones = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener refacciones:', err);
          this.error = 'Ocurrió un error al cargar las refacciones. Por favor, revisa la consola para más detalles.';
          this.isLoading = false;
        }
      });
  }

  get filteredRefacciones(): RefaccionApi[] {
    if (!this.searchTerm) {
      return this.refacciones;
    }

    const lowerTerm = this.searchTerm.toLowerCase();
    return this.refacciones.filter(refaccion =>
      refaccion.nombre.toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * Corrige la construcción de la URL de la imagen.
   * Si la cadena de la imagen ya es una URL completa, la usa directamente.
   * Si no, la concatena con la URL base de Cloudinary.
   */
  getRefaccionImageUrl(imagePath: string, width: number = 400, height: number = 200): string {
    if (!imagePath) {
        return `https://placehold.co/${width}x${height}/cccccc/ffffff?text=No+Image`;
    }

    // Si contiene una URL completa incrustada después de "upload/", la extraemos
    const match = imagePath.match(/https?:\/\/[^\s]+/);
    if (match) {
        return match[0].replace(
            '/upload/',
            `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`
        );
    }

    // Si es ruta relativa, la armamos optimizada
    return `https://res.cloudinary.com/dfdcovbqs/image/upload/f_auto,q_auto,w_${width},h_${height},c_fill/${imagePath}`;
}
  getStatusClass(estatus: boolean): string {
    return estatus ? 'status-success' : 'status-error';
  }

  getStatusText(estatus: boolean): string {
    return estatus ? 'Disponible' : 'Agotado';
  }
  
  exportRefaccionesPdf(): void {
    this.isLoading = true;
    this.http.get(this.exportPdfUrl, { responseType: 'blob' }).subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'refacciones.pdf';
        link.click();
        URL.revokeObjectURL(fileURL);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al exportar PDF:', err);
        this.isLoading = false;
        this.error = 'No se pudo exportar el PDF. Intenta de nuevo más tarde.';
      }
    });
  }

  /**
   * Función para rastrear elementos en *ngFor por su ID para un mejor rendimiento
   * y para asegurar que los enlaces dinámicos se generen correctamente.
   */
  trackById(index: number, refaccion: RefaccionApi): number {
    return refaccion.id;
  }
}
