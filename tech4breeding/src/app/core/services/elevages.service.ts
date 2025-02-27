import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElevagesService {

  apiUrl="http://localhost:2025/api/users"
  apiUrl2="http://localhost:2025/api/poulets"
  constructor(private httpclient: HttpClient) { }
  LoadUsers(): Observable<User[]>{
    return this.httpclient.get<User[]>(this.apiUrl);
  }
    // Méthode pour récupérer les éleveurs
    getUsers(): Observable<any> {
      return this.httpclient.get<any>(this.apiUrl);
    }
  // Créer un éleveur
  createUser(user: any): Observable<any> {
   
    return this.httpclient.post<any>(this.apiUrl, user);
  }
  // Éditer un éleveur
    editUser(id: number, user: any): Observable<any> {
      return this.httpclient.put<any>(`${this.apiUrl}/${id}`, user);
    }
   // Supprimer un éleveur
   deleteUser(id: number): Observable<any> {
    return this.httpclient.delete<any>(`${this.apiUrl}/${id}`);
  }
  //nombre de poulet qui est disponible
  getPouletCount(): Observable<any> {
    return this.httpclient.get<{ count: number }>(`${this.apiUrl2}/count`);
  }
}
