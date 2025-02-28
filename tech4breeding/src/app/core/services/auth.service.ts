import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthResponse } from '../../models/AuthResponse'; // Interface pour la réponse d'authentification
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:2025/api'; // URL de votre API
  private tokenKey = 'authToken'; // Clé pour le token dans localStorage
  private userNameKey = 'userName'; // Clé pour le nom d'utilisateur dans sessionStorage

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les éleveurs.
   */
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère un éleveur par ID.
   */
  getByCode(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Enregistre un nouvel utilisateur.
   */
  register(inputData: any): Observable<any> {
    return this.http.post(this.apiUrl, inputData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Met à jour les informations d'un utilisateur.
   */
  updateUser(id: any, inputData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, inputData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Connecte un utilisateur et retourne un observable avec la réponse.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère les données du tableau de bord en envoyant le token dans l'en-tête.
   */
  getDashboard(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token is missing');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/dashboard`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Récupère le token depuis localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Sauvegarde le token dans localStorage.
   */
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Sauvegarde le nom d'utilisateur dans sessionStorage.
   */
  saveUserName(userName: string): void {
    sessionStorage.setItem(this.userNameKey, userName);
  }

  /**
   * Récupère le nom d'utilisateur depuis sessionStorage.
   */
  getUserInfo(): string {
    const storedName = sessionStorage.getItem(this.userNameKey);
    return storedName || 'Utilisateur non connecté';
  }

  /**
   * Récupère les rôles utilisateur depuis le token JWT.
   */
  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);  // Décodage du token
      return decoded.roles || [];
    } catch (e) {
      console.error('Erreur de décodage du token', e);
      return [];
    }
  }

  /**
   * Supprime le token et les informations utilisateur.
   */
  removeUserInfo(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.userNameKey);
  }

  /**
   * Supprime uniquement le token.
   */
  removeToken() {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Gère les erreurs HTTP.
   */
  private handleError(error: any): Observable<never> {
    console.error('Une erreur s\'est produite:', error);
    return throwError(error.message || 'Erreur du serveur');
  }
}
