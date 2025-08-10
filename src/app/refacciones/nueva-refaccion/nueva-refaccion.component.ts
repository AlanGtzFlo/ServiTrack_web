import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-nueva-refaccion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './nueva-refaccion.component.html',
  styleUrls: ['./nueva-refaccion.component.scss']
})
export class NuevaRefaccionComponent implements OnInit {
  // Objeto para almacenar los datos del formulario, coincidiendo con la estructura de la API.
  refaccion: any = {
    nombre: '',
    descripcion: '',
    codigo: '',
    fabricante: '',
    vida_util_estimada: '',
    estatus: true
  };

  // Variable para almacenar el archivo de imagen seleccionado por el usuario.
  selectedFile: File | null = null;

  // URL de la API a la que se enviarán los datos.
  private apiUrl = 'https://fixflow-backend.onrender.com/api/refacciones/';

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void { }

  /**
   * Maneja el evento de selección de archivo del input <input type="file">.
   * Almacena el archivo seleccionado en la propiedad `selectedFile`.
   * @param event El evento de cambio del input.
   */
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  /**
   * Envía los datos de la nueva refacción a la API.
   * Utiliza FormData para incluir tanto los campos de texto como el archivo de imagen.
   * Si la solicitud es exitosa, redirige al usuario a la página de refacciones.
   */
  crearRefaccion(): void {
    // Se asegura de que se haya seleccionado un archivo antes de proceder.
    if (!this.selectedFile) {
      console.error('Por favor, selecciona una imagen para la refacción.');
      return;
    }

    // Se crea un objeto FormData para enviar los datos multipartes.
    const formData = new FormData();
    formData.append('nombre', this.refaccion.nombre);
    formData.append('descripcion', this.refaccion.descripcion);
    formData.append('codigo', this.refaccion.codigo);
    formData.append('fabricante', this.refaccion.fabricante);
    formData.append('vida_util_estimada', this.refaccion.vida_util_estimada);
    // Convierte el valor booleano 'estatus' a una cadena para enviarlo.
    formData.append('estatus', this.refaccion.estatus.toString());
    // Añade el archivo de imagen al FormData. 'imagen' debe coincidir con el nombre del campo en la API.
    formData.append('imagen', this.selectedFile, this.selectedFile.name);

    console.log('Enviando datos de la nueva refacción (FormData):', formData);

    // Se realiza la llamada HTTP POST a la API con el objeto FormData.
    this.http.post(this.apiUrl, formData)
      .pipe(
        // Captura y maneja cualquier error que pueda ocurrir durante la solicitud.
        catchError(error => {
          console.error('Error al crear la refacción:', error);
          return of(null); // Retorna un observable vacío para evitar que la aplicación se detenga.
        })
      )
      .subscribe(response => {
        // Si la respuesta es exitosa (no es nula), se realiza la redirección.
        if (response) {
          console.log('Refacción creada con éxito:', response);
          this.router.navigate(['/refacciones']);
        }
      });
  }
}