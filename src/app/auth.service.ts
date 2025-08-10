import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Un BehaviorSubject para gestionar y emitir el rol del usuario
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  public userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  constructor() {
    // Intentar cargar el rol del usuario desde el localStorage al iniciar el servicio
    const user = localStorage.getItem('user_data');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.user && userData.user.rol) {
          this.userRoleSubject.next(userData.user.rol);
        }
      } catch (e) {
        console.error('Error al parsear user_data de localStorage en AuthService:', e);
        localStorage.removeItem('user_data');
      }
    }
  }

  /**
   * Método para actualizar el rol del usuario y notificar a los suscriptores.
   * Este método debe ser llamado desde el LoginComponent después de un login exitoso.
   */
  setUserRole(userData: any): void {
    // Almacenar el objeto completo del usuario en localStorage
    localStorage.setItem('user_data', JSON.stringify(userData));
    // Y emitir el rol a los suscriptores
    if (userData.user && userData.user.rol) {
      this.userRoleSubject.next(userData.user.rol);
    } else {
      this.userRoleSubject.next(null);
    }
  }

  /**
   * Obtiene el rol del usuario de forma síncrona (si está disponible).
   * Útil para la visibilidad de elementos de la UI.
   */
  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }
  
  /**
   * Método para cerrar la sesión y limpiar todos los datos del usuario.
   */
  logoutAndClearData(): void {
    // Eliminar los datos del localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    // Notificar a los suscriptores que el usuario ha cerrado sesión
    this.userRoleSubject.next(null);
  }
}