// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /* ─── Datos del formulario ─── */
  username = ''; // Este campo debe contener el CORREO ELECTRÓNICO
  password = '';
  errorMessage: string | null = null; // Para mostrar mensajes de error en la UI

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  /* ─── Autenticación con API ─── */
  onLogin(): void {
    this.errorMessage = null; // Limpia cualquier mensaje de error anterior
    const loginUrl = 'https://fixflow-backend.onrender.com/api/login/'; // Tu endpoint de login

    // La API de Django espera 'correo' y 'password'
    const payload = {
      correo: this.username, // ¡Asegúrate de que el 'username' del formulario sea el 'correo' aquí!
      password: this.password
    };

    console.log('LoginComponent: Enviando solicitud de login con payload:', payload); // Debug: Payload enviado

    this.http.post<any>(loginUrl, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('LoginComponent: Error en la solicitud de login:', error);
          if (error.status === 400) {
            this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
          } else if (error.status === 401) {
            this.errorMessage = 'Acceso no autorizado. Tu sesión puede haber expirado o no tienes permisos.';
          } else {
            this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo más tarde.';
          }
          return throwError(() => new Error(this.errorMessage || 'Error desconocido'));
        })
      )
      .subscribe(response => {
        console.log('LoginComponent: Login exitoso. Respuesta de la API:', response); // Debug: Respuesta completa de la API
        // Almacena el token de acceso y los datos del usuario
        if (response && response.access) {
          localStorage.setItem('access_token', response.access);
          console.log('LoginComponent: access_token guardado en localStorage.');

          // Guarda toda la respuesta si es útil, incluyendo nombre y rol
          localStorage.setItem('user_data', JSON.stringify(response));
          console.log('LoginComponent: user_data guardado en localStorage:', JSON.stringify(response));

          this.router.navigate(['/inicio']); // Navega a la página de inicio
        } else {
          this.errorMessage = 'Login exitoso, pero no se recibió un token de acceso válido.';
          console.warn('LoginComponent: No se recibió un token de acceso válido en la respuesta.');
        }
      });
  }
}
