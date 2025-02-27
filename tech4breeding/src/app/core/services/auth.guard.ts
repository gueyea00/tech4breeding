import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Assurez-vous d'avoir un service pour l'authentification

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const userRole = sessionStorage.getItem('userRole');

      const rolesAllowed = route.data['roles'] as Array<string>; // Type de roles

    // Vérifier si l'utilisateur est connecté
    if (!this.authService.getToken) {
      this.router.navigate(['/login']);
      return false;
    }

    // Vérifier si l'utilisateur a les rôles nécessaires
    const userRoles = this.authService.getUserInfo(); // Récupérer les rôles de l'utilisateur
    const requiredRoles = route.data['roles'] as Array<string>; // Les rôles requis pour la route

    // Si aucun rôle n'est requis, l'accès est autorisé
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Vérifier si l'utilisateur a un rôle valide
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    if (!hasRole) {
      this.router.navigate(['/unauthorized']); // Redirigez vers une page d'accès non autorisé
      return false;
    }

    return true;
  }
}
