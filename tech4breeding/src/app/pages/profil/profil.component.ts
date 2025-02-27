import { Component } from '@angular/core';

@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  
  storedName = sessionStorage.getItem('userName');
  storedEmail = sessionStorage.getItem('userEmail');
   
}
