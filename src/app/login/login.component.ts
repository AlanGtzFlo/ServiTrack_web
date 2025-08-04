// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /* ─── Datos del formulario ─── */
  username = '';
  password = '';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  /* ─── Autenticación de ejemplo ─── */
  onLogin(): void {
    if (this.username === 'admin' && this.password === 'password') {
      console.log('Login exitoso');
      this.router.navigate(['/inicio']); // Ajusta la ruta a tu conveniencia
    } else {
      console.log('Credenciales incorrectas');
      // Se ha reemplazado alert con console.log según las instrucciones.
      // Puedes implementar un modal o un mensaje personalizado aquí si lo necesitas.
      console.log('Usuario o contraseña incorrectos.');
    }
  }
}