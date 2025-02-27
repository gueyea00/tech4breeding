import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ElevagesService } from '../../../core/services/elevages.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../../../models/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, NgxSpinnerModule],
})
export class RegisterComponent implements OnInit {
  userList: User[] = [];
  
  registerForm: FormGroup;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: ElevagesService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    // Initialisation du formulaire avec les validations
    this.registerForm = this.builder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required]],
      localisation: ['', Validators.required],
      mot_de_passe: [
        '',
        [
          Validators.required
        ],
      ],
      role:['']
        });
     
  }

  ngOnInit(): void {
    console.log(this.registerForm.value);
    this.LoadUsers()
  }

  LoadUsers() {

    this.service.LoadUsers().subscribe((item: User[]) => {
      this.userList = item;
      console.log(this.userList)
      });
  }
  // Méthode d'enregistrement de l'utilisateur
  registerUser() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;



      // Affichage du spinner pendant la soumission
      this.spinner.show();

      // Appel du service pour enregistrer l'utilisateur
      this.service.createUser(formData).subscribe(
        (response) => {
          // Masquer le spinner après la soumission
          this.spinner.hide();

          // Notification de succès
          this.toastr.success(
            'Veuillez contacter l\'administrateur pour activer l\'accès',
            'Enregistrement réussi'
          );

          // Redirection vers la page de connexion
          this.router.navigate(['login']);
        },
        (error) => {
          // Masquer le spinner en cas d'erreur
          this.spinner.hide();

          // Notification d'erreur
          this.toastr.error(
            'L\'enregistrement a échoué. Veuillez réessayer plus tard.',
            'Échec de l\'enregistrement'
          );

          // Affichage des détails de l'erreur dans la console
          console.error('Erreur lors de l\'enregistrement:', error);
        }
      );
    } else {
      // Notification en cas de formulaire invalide
      this.toastr.warning('Veuillez fournir des données valides');
      console.log('Formulaire invalide:', this.registerForm.value);
    }
  }
}
