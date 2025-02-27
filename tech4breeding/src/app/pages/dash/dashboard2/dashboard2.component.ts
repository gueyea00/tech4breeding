import { Component, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard2',
  standalone: true,
    imports: [NgApexchartsModule],
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.css'
})
export class Dashboard2Component {

  @ViewChild('chart') chart!: ChartComponent;  // Correctement typé avec ChartComponent
  pouletCount!: number;

  // Options du premier graphique (ventes mensuelles)
  public chartOptions1: any = {
    series: [
      {
        name: 'Ventes',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 90, 85, 30, 120]
      }
    ],
    chart: {
      height: 350,
      type: 'line'
    },
    title: {
      text: 'Ventes Mensuelles'
    },
    xaxis: {
      categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };
}
