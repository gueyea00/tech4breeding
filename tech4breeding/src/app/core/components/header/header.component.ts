import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderItem } from '../../../models/layout.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [CommonModule, RouterModule,ToastrModule],
})
export class HeaderComponent implements OnInit {
  userName!: string;
  constructor(private authService: AuthService,private router:Router,private toastr:ToastrService){}
  ngOnInit(): void {
    this.userName = this.authService.getUserInfo(); 
 // Récupérer le nom et prénom de l'utilisateur
  }
   // Connected User
   user = {
    photo: 'assets/user-photo.jpg'
  };
  isDropdownOpen: boolean = false;
  toggleDropdown() {
  this.isDropdownOpen= true
  console.log(this.isDropdownOpen)    
  }
  // currentLanguage: string = 'en';
  // languages: string[] = ['Fr', 'En', 'Es'];
  userPhoto: string = 'song.jpg'; // Path to the user photo
  // Switch Language
  switchLanguage(lang: string) {
    // this.currentLanguage = lang;
    console.log(`Language switched to: ${lang}`);
    this.toastr.success('Déconnexion réussie', 'Au revoir!'+lang);

    // Add your language change logic here
  }

  // Logout
  logout() {
    // Suppression du token et des informations utilisateur
    this.authService.removeUserInfo();
    
    // Afficher un toast (facultatif)
    this.toastr.success('Déconnexion réussie', 'Au revoir!');
    
    // Redirection vers la page de login
    this.router.navigate(['/login']);
  }
  
  headerItems: HeaderItem[] = [
    {
      label: 'Home',
      icon: 'bi bi-house-door',
      link: '/home'
    },
    {
      label: 'Profile',
      icon: 'person',
      link: '/profile'
    },
    {
      label: 'Notifications',
      icon: 'notifications',
      link: '/notifications'
    }
  ];
  getUserInfo(): string {
    const storedName = sessionStorage.getItem('userName');
    console.log('Valeur récupérée depuis sessionStorage:', storedName);
    return storedName || 'Utilisateur non connecté';
  }


}
