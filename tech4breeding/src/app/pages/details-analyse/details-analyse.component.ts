import { AfterViewInit, Component, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { Prediction } from '../../models/predict';
import { PredictionService } from '../../core/services/prediction.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details-analyse',
  templateUrl: './details-analyse.component.html',
  styleUrl: './details-analyse.component.scss',
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class DetailsAnalyseComponent implements OnInit {
  predictions: Prediction[] = []; // Liste complète des prédictions
  filteredPredictions: Prediction[] = []; // Liste filtrée pour la recherche
  searchTerm: string = ''; // Valeur d'entrée pour filtrer
  totalSickChickens: number = 0; // Total des poulets malades

  constructor(
    private predictionService: PredictionService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getPredictions();
  }

  // Récupère les prédictions depuis le backend
  getPredictions(): void {
    this.http.get('http://localhost:2025/api/predictions').subscribe(
      (data: any) => {
        this.predictions = data;

        // Calcul du total des poulets malades
        this.totalSickChickens = this.predictions.filter(
          (prediction) => prediction.class_predite.toLowerCase() !== 'healthy'
        ).length;

        console.log('Total des poulets malades:', this.totalSickChickens);
      },
      (error) => {
        console.error('Erreur lors de la récupération des prédictions:', error);
      }
    );
  }

  // Filtre les prédictions en fonction du terme de recherche
  filterPredictions(): void {
    this.filteredPredictions = this.predictions.filter((prediction) =>
      prediction.class_predite.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
