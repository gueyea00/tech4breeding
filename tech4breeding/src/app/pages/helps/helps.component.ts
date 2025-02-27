import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrls: ['./helps.component.scss'],
  imports:[ CommonModule,FormsModule],
  standalone: true
})
export class HelpsComponent {
  private model: tf.Sequential | null = null; // Le modèle TensorFlow
  inputValues: string = ''; // Stocke les valeurs d'entrée sous forme de chaîne
  predictions: number[] | null = null; // Stocke les prédictions du modèle

  // Méthode pour créer le modèle
  createModel(): void {
    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({
        inputShape: [1],
        units: 1
      })
    );
    this.model.compile({
      optimizer: tf.train.sgd(0.1),
      loss: 'meanSquaredError'
    });
    console.log('Modèle créé avec succès');
  }

  // Méthode pour entraîner le modèle
  async trainModel(): Promise<void> {
    if (!this.model) {
      console.log('Modèle non créé');
      return;
    }
    // Données d'entraînement
    const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
    const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

    // Entraînement du modèle
    await this.model.fit(xs, ys, {
      epochs: 200,
      verbose: 0
    });
    console.log('Modèle entraîné avec succès');
  }

  // Méthode pour faire une prédiction
  makePrediction(): void {
    if (!this.model) {
      console.log('Modèle non chargé');
      return;
    }

    // Convertir les entrées utilisateur en tableau de nombres
    const inputs = this.inputValues
      .split(',')
      .map((val) => parseFloat(val.trim()));

    if (inputs.some(isNaN)) {
      console.log('Entrées invalides');
      return;
    }

    // Convertir les entrées en tenseurs et prédire
    const tensorInput = tf.tensor2d(inputs, [inputs.length, 1]);
    const prediction = this.model.predict(tensorInput) as tf.Tensor;
    this.predictions = Array.from(prediction.dataSync()); // Convertir les prédictions en tableau
    tensorInput.dispose(); // Libérer la mémoire
  }
}
