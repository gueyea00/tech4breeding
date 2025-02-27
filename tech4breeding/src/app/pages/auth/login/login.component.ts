import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  // Importer ToastrService
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../models/AuthResponse';  // Importer AuthResponse
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule, NgxSpinnerModule]
})
export class LoginComponent {
onOut() {
this.router.navigateByUrl('/register')
}
forgetPassword() {
this.router.navigateByUrl('/passwordForgot')}

  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    
   }

  onSubmit(): void {
    // Démarrer le spinner
    this.spinner.show();

    this.authService.login(this.loginData.email, this.loginData.password).subscribe(
      (response: AuthResponse) => {
        // Arrêter le spinner
        this.spinner.hide();

        console.log('Réponse du serveur :', response);

        if (response && response.user) {
          // Stocker les données utilisateur
          const user = response.user;
          const userName = `${user.nom} ${user.prenom}`;
          const userEmail = user.email;
          const userRole = user.role;

          sessionStorage.setItem('userName', userName);
          sessionStorage.setItem('userEmail', userEmail);
          sessionStorage.setItem('userRole', userRole.toString());
          localStorage.setItem('localUserData', JSON.stringify(user));
          this.authService.saveToken(response.token);

          console.log('Utilisateur enregistré dans sessionStorage :', userName);

          // Afficher un message de succès
          this.toastr.success('Connexion réussie!', `Bienvenue ${userName} !`);

          // Rediriger en fonction du rôle
          let redirectUrl = '/dashboard';
          if (userRole === 'eleveur') {
            redirectUrl = '/dashboard/eleveur';
          } else if (userRole === 'veterinaire') {
            redirectUrl = '/dashboard/veterinaire';
          } 
          else if (userRole === 'admin') {
            redirectUrl = '/dashboard';
          } else if (userRole !== 'admin') {
            this.toastr.warning('Rôle utilisateur non reconnu.', 'Attention');
            return;
          }

          this.router.navigateByUrl(redirectUrl);
        } else {
          console.error('Réponse invalide du serveur');
          this.toastr.error('Échec de la connexion.', 'Erreur');
        }
      },
      (error) => {
        // Arrêter le spinner en cas d'erreur
        this.spinner.hide();

        console.error('Erreur de connexion :', error);

        // Vérifier si une erreur détaillée est présente
        const errorMessage = error.error?.message || 'Échec de la connexion. Vérifiez vos identifiants.';
        this.toastr.error(errorMessage, 'Erreur');
      }
    );
  }
}
