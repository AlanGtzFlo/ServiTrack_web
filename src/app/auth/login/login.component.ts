// src/app/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; // Importa FormsModule para ngModel
import { Router, RouterModule } from '@angular/router'; // Importa Router y RouterModule

@Component({
  selector: 'app-login',
  standalone: true, // ¡Importante si usas standalone components!
  imports: [CommonModule, FormsModule, RouterModule], // Asegúrate de importar FormsModule y RouterModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userId: string = '';
  password: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Aquí puedes añadir lógica inicial, como verificar si ya hay un token de sesión
  }

  onLogin(): void {
    // FRONT-END ÚNICAMENTE: Simulación de inicio de sesión.
    // En un proyecto real, aquí llamarías a un servicio de autenticación (backend).
    console.log('Intentando iniciar sesión con:', this.userId, this.password);

    // Simulación de redirección tras un login exitoso.
    // Redirige al dashboard.
    this.router.navigate(['/dashboard']);
  }

  // Este botón "Cancelar" es más prominente en la versión móvil,
  // pero podemos mantenerlo en la web o hacerlo un enlace de "volver".
  onCancel(): void {
    console.log('Login cancelado. Limpiando campos.');
    this.userId = '';
    this.password = '';
    // Podrías redirigir a una página pública o simplemente limpiar.
  }

  forgotPassword(): void {
    console.log('Navegar a la página de recuperación de contraseña o abrir modal.');
    // Aquí podrías navegar a una ruta /forgot-password
  }
}