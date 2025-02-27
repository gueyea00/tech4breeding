import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  
})
export class SettingsComponent {
  constructor(private fb: FormBuilder) {
    
  }
  // Déclaration de la variable
  securityForm!: FormGroup; 
  ngOnInit(): void {
    this.securityForm = this.fb.group({
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      enable2FA: [false],
    });
  }

  updateSecurity(): void {
    if (this.securityForm.valid) {
      console.log(this.securityForm.value);
      alert('Paramètres de sécurité mis à jour.');
    } else {
      alert('Veuillez remplir correctement tous les champs.');
    }
  }
  menuItems = [
    'Sécurité',
    'Supprimer le compte'
  ];
  selectedMenuItem: number = 0;
  storedName = sessionStorage.getItem('userName');
  storedEmail = sessionStorage.getItem('userEmail');

  selectMenuItem(index: number): void {
    this.selectedMenuItem = index;
  }
  teams = [
    { id: 1, name: 'Marketing', role: 'Manager' },
    { id: 2, name: 'Développement', role: 'Développeur' }
  ];
  
  teamMembers = [
    { id: 1, name: 'John Doe', role: 'Chef', active: true },
    { id: 2, name: 'Jane Smith', role: 'Designer', active: false }
  ];
  
  billing = {
    plan: 'Premium',
    renewalDate: '2025-01-15',
    paymentMethod: 'Carte Visa se terminant par 1234'
  };
  //Methode d'affichage Mise a jour
  updateProfile() {
    console.log('Mise à jour du profil effectuée.');
  }
  

  
  leaveTeam(teamId: number) {
    console.log(`Quitter l'équipe ${teamId}`);
  }
  
  removeMember(memberId: number) {
    console.log(`Supprimer le membre ${memberId}`);
  }
  
  exportData() {
    console.log('Données exportées.');
  }
  
  confirmDelete() {
    if (confirm('Voulez-vous vraiment supprimer votre compte ?')) {
      console.log('Compte supprimé.');
    }
  }
  
}
