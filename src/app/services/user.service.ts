// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos la interfaz que coincide con los datos de tu API
export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  is_active: boolean;
  fecha_registro: string;
  foto: string;
  telefono: string | null;
  direccion: string | null;

}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Asumiendo que esta es la URL de tu API
  private apiUrl = 'https://54f8a907472b.ngrok-free.app/api/usuarios/';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
