import { Component, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ElevagesService } from '../../../core/services/elevages.service';
import { Prediction } from '../../../models/predict';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard4',
  imports: [NgApexchartsModule],
  templateUrl: './dashboard4.component.html',
  styleUrl: './dashboard4.component.css',
  standalone: true,
})
export class Dashboard4Component {
  @ViewChild('chart') chart!: ChartComponent; // Correctement typé avec ChartComponent
  pouletCount!: number;
  predictions: Prediction[] = []; // Liste complète des prédictions
  totalSickChickens: number = 0; // Total des poulets malades
  totalHealthyChickens: number = 100; // Total des poulets sains

  // Options du graphique (répartition de la santé des poulets)
  public chartOptions3: any = {
    series: [0, 0], // Initialisé avec des valeurs par défaut
    chart: {
      height: 350,
      type: 'pie', // Type de graphique en camembert
    },
    title: {
      text: 'Répartition de la Santé des Poulets',
    },
    labels: ['Sains', 'Malades'], // Libellés pour chaque section du graphique
    colors: ['#28a745', '#dc3545'], // Vert pour sain, rouge pour malade
  };

  constructor(private service: ElevagesService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getPredictions();
  }

  getPredictions(): void {
    this.http.get('http://localhost:2025/api/predictions').subscribe(
      (data: any) => {
        this.predictions = data;

        // Calcul des poulets sains et malades
        this.totalSickChickens = this.predictions.filter(
          (prediction) => prediction.class_predite.toLowerCase() !== 'healthy'
        ).length;

        this.totalHealthyChickens = this.predictions.length - this.totalSickChickens;

        // Mise à jour des séries du graphique
        this.chartOptions3.series = [this.totalHealthyChickens, this.totalSickChickens];

        console.log('Total des poulets malades:', this.totalSickChickens);
        console.log('Total des poulets sains:', this.totalHealthyChickens);
      },
      (error) => {
        console.error('Erreur lors de la récupération des prédictions:', error);
      }
    );
  }
}
