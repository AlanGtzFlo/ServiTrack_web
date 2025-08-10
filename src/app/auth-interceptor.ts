import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Obtener el token del localStorage
    const authToken = localStorage.getItem('access_token');

    // 2. Si existe un token, clonar la solicitud y agregar el encabezado de autorización
    if (authToken) {
      console.log('AuthInterceptor: Token encontrado. Agregando encabezado de autorización.');
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      // 3. Pasar la solicitud clonada al siguiente manejador
      return next.handle(clonedRequest);
    }

    // 4. Si no hay token, pasar la solicitud original sin modificar
    return next.handle(request);
  }
}
