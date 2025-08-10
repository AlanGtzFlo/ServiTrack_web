// src/app/users/new-user/new-user.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  phone?: string | null;
  profileImageUrl?: string;
  address?: string | null;
}

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  newUser: NewUser = {
    name: '',
    email: '',
    password: '',
    role: 'Administrador',
    status: 'Activo',
    phone: null,
    address: null
  };
  confirmPassword = '';
  roles = ['Administrador', 'Técnico', 'Atención a Cliente', 'Supervisor'];
  statuses = ['Activo', 'Inactivo'];
  selectedFile: File | null = null;

  private apiUrl = 'https://54f8a907472b.ngrok-free.app/api/usuarios/';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  saveNewUser(): void {
    if (this.newUser.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.newUser.name);
    formData.append('correo', this.newUser.email);
    formData.append('password', this.newUser.password);
    formData.append('rol', this.reverseMapRole(this.newUser.role));
    formData.append('is_active', this.newUser.status === 'Activo' ? 'true' : 'false');
    if (this.newUser.phone) formData.append('telefono', this.newUser.phone);
    if (this.newUser.address) formData.append('direccion', this.newUser.address);
    if (this.selectedFile) formData.append('foto', this.selectedFile, this.selectedFile.name);

    this.http.post(this.apiUrl, formData).subscribe({
      next: () => {
        alert('Usuario creado correctamente.');
        this.router.navigate(['/users']);
      },
      error: () => {
        alert('Error al crear usuario.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  private reverseMapRole(role: string): string {
    switch (role) {
      case 'Administrador': return 'admin';
      case 'Técnico': return 'tecnico';
      case 'Atención a Cliente': return 'cliente';
      case 'Supervisor': return 'supervisor';
      default: return 'cliente';
    }
  }
}
