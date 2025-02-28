import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accueil',
  standalone: false,
  
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.scss'
})
export class AccueilComponent {
  constructor(private router: Router){}
  onOut() {
    this.router.navigateByUrl('/login');
    console.log('ok')
    }
}
