import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  public userRole$: Observable<string | null> = this.userRoleSubject.asObservable();

  private currentUserIdSubject = new BehaviorSubject<number | null>(null);
  public currentUserId$: Observable<number | null> = this.currentUserIdSubject.asObservable();

  constructor() {
    const user = localStorage.getItem('user_data');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.user) {
          if (userData.user.rol) {
            this.userRoleSubject.next(userData.user.rol);
          }
          if (userData.user.id) {
            this.currentUserIdSubject.next(userData.user.id);
          }
        }
      } catch (e) {
        console.error('Error al parsear user_data de localStorage en AuthService:', e);
        localStorage.removeItem('user_data');
      }
    }
  }

  setUserRole(userData: any): void {
    localStorage.setItem('user_data', JSON.stringify(userData));
    if (userData.user && userData.user.rol) {
      this.userRoleSubject.next(userData.user.rol);
    } else {
      this.userRoleSubject.next(null);
    }
    if (userData.user && userData.user.id) {
      this.currentUserIdSubject.next(userData.user.id);
    } else {
      this.currentUserIdSubject.next(null);
    }
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  logoutAndClearData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    this.userRoleSubject.next(null);
    this.currentUserIdSubject.next(null);
  }
}
