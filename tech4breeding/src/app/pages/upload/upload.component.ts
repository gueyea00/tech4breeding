import { Component } from '@angular/core';
import { PredictionService } from '../../core/services/prediction.service';
import { CommonModule } from '@angular/common';
import { Prediction } from '../../models/predict';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [CommonModule]
})
export class UploadComponent {
  selectedFile: File | null = null;
  prediction: Prediction | null = null;  // Utilisation de "Prediction | null" pour éviter les erreurs de typage
  userP: Prediction = { class_predite: '', confiance: 0 , date: new Date,image:'images.jpeg'};  // Initialisation de userP avec des valeurs par défaut
  
  constructor(private apiService: PredictionService, private toastr : ToastrService) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.selectedFile) {
      this.apiService.predictImage(this.selectedFile).subscribe(
        (response: Prediction) => {
          this.prediction = response;
          console.log('Prediction:', this.prediction);
          this.toastr.success('Donnée gérée avec succès','Traitement')
          // Assigner les valeurs après avoir vérifié que prediction n'est pas null
          if (this.prediction) {
            this.userP.class_predite = this.prediction.class_predite;
            this.userP.confiance = this.prediction.confiance;
          }
        },
        (error) => {
          console.error('Error:', error);
          this.toastr.error('Un problème est survenu','Error')

        }
      );
    }
  }
}
