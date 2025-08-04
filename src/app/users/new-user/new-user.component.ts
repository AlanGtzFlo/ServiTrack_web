// src/app/users/new-user/new-user.component.ts (Ejemplo, adapta a tu lógica real)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

// Define una interfaz para el nuevo usuario si no la tienes
interface NewUser {
  name: string;
  email: string;
  password?: string; // Opcional si no siempre se establece aquí
  role: string;
  status: string;
  phone?: string;
  profileImageUrl?: string; // Para guardar la URL de la imagen si se sube
}

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  newUser: NewUser = {
    name: '',
    email: '',
    role: 'Empleado', // Valor por defecto
    status: 'Activo' // Valor por defecto
  };
  confirmPassword = '';
  roles: string[] = ['Administrador', 'Empleado', 'Técnico']; // Ejemplo de roles
  statuses: string[] = ['Activo', 'Inactivo', 'Vacaciones']; // Ejemplo de estados
  selectedFile: File | null = null; // Para manejar el archivo seleccionado

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Aquí podrías leer el archivo y mostrar una vista previa si lo deseas
      // Por ejemplo, usando FileReader
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.newUser.profileImageUrl = e.target.result; // Si quieres mostrar la imagen directamente
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
    }
  }

  saveNewUser(): void {
    if (this.newUser.password !== this.confirmPassword) {
      console.error('Las contraseñas no coinciden.');
      // Aquí podrías mostrar un mensaje al usuario en la UI
      return;
    }
    // Lógica para guardar el nuevo usuario
    console.log('Guardando nuevo usuario:', this.newUser);
    if (this.selectedFile) {
      console.log('Archivo de imagen seleccionado:', this.selectedFile.name);
      // Aquí deberías implementar la lógica para subir la imagen a un servicio de almacenamiento
      // y luego guardar la URL en newUser.profileImageUrl
    }
    // Después de guardar, podrías navegar a la lista de usuarios o mostrar un mensaje de éxito
    this.router.navigate(['/users']); // Ejemplo de navegación
  }

  cancel(): void {
    console.log('Creación de usuario cancelada.');
    this.router.navigate(['/users']); // Ejemplo de navegación de vuelta
  }
}
