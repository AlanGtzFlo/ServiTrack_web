// src/app/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take, filter } from 'rxjs/operators'; // Se ha añadido 'filter' aquí

/**
 * Guardian de ruta que controla el acceso basado en el rol del usuario.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // El guardián ahora se suscribe al Observable del rol del usuario
  return authService.userRole$.pipe(
    // Espera hasta que el rol no sea null y usa un type guard para el resto del pipe
    filter((userRole): userRole is string => userRole !== null),
    take(1), // Toma el primer valor disponible y completa el observable
    map(userRole => {
      // Obtiene los roles permitidos de la configuración de la ruta
      const allowedRoles = route.data['roles'] as string[];

      console.log(`AuthGuard: Verificando acceso para la ruta: ${state.url}`);
      console.log(`AuthGuard: Rol del usuario: ${userRole}`);
      console.log(`AuthGuard: Roles permitidos: ${allowedRoles}`);
      
      // Si el rol está en la lista de roles permitidos, permite la activación
      const canActivate = allowedRoles.includes(userRole);

      if (canActivate) {
        console.log('AuthGuard: Acceso permitido.');
        return true;
      } else {
        console.log('AuthGuard: Acceso denegado. Redirigiendo a dashboard.');
        // Redirige al dashboard o a una página de acceso denegado
        router.navigate(['/dashboard']); 
        return false;
      }
    })
  );
};