import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prediction } from '../../models/predict';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private apiUrl = 'http://localhost:2025/api/predict';  // URL de l'API Flask

  constructor(private http : HttpClient) { }
 // Méthode pour envoyer une image et obtenir une prédiction
 predictImage(image: File): Observable<any> {
  const formData = new FormData();
  formData.append('image', image, image.name);

  return this.http.post<any>(this.apiUrl, formData);
}
getPredictions(): Observable<Prediction[]> {
  return this.http.get<Prediction[]>(this.apiUrl);
}
}
