import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  imports: [CommonModule],
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements AfterViewInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef;
  prediction: string | null = null;

  private apiUrl: string = 'http://localhost:2025/api/predict'; // L'URL de votre API

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // Accéder à la caméra du navigateur après l'initialisation de la vue
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch((err) => {
        console.error('Erreur lors de l\'accès à la caméra:', err);
      });
  }

  // Fonction pour capturer l'image
  captureImage(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir l'image en Blob (au lieu de base64)
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          // Envoyer l'image (Blob) au backend pour analyse
          this.predictImage(blob).subscribe((response: any) => {
            this.prediction = response.result;
          }, (error) => {
            console.error('Erreur lors de l\'analyse:', error);
          });
        }
      }, 'image/jpeg');
    }
  }

  // // Fonction pour envoyer l'image au backend sous forme de Blob
  // predictImage(imageData: Blob): Observable<any> {
  //   const formData = new FormData();
  //   // Ajouter l'image en Blob au FormData
  //   formData.append('image', imageData, 'chicken.jpg'); // 'chicken.jpg' est le nom du fichier

  //   return this.http.post<any>(this.apiUrl, formData);
  // }
  predictImage(imageData: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageData, 'chicken.jpg');
  
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap((response: any) => {
        console.log('Réponse du serveur:', response);
        if (response && response.class && response.confidence) {
          this.prediction = `Class: ${response.class}, Confidence: ${response.confidence.toFixed(2)}%`;
          console.log('Prediction:', this.prediction);
        } else {
          console.error('La prédiction est manquante dans la réponse');
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'analyse:', error);
        return throwError(error);
      })
    );
  }
  
}
