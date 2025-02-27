import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ElevagesService } from '../../core/services/elevages.service';
import { User } from '../../models/User';
import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';

@Component({
  imports: [DataTablesModule, CommonModule, FormsModule,NgxSpinnerModule],
  selector: 'app-user-account',
  styleUrls: ['./user-account.component.scss'],
  templateUrl: './user-account.component.html',
})
export class UserAccountComponent implements OnInit {
  isLoading: boolean = false;
editUser(_t45: User) {
throw new Error('Methode Non Implementer');
}
  userList: User[] = [];
  newUser: User = {
    id_user: null,
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    telephone: '',
    localisation: '',
    role:['']
  };
  deleteUserId: any = null;
  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();

  fields: { key: keyof User, label: string, type: string }[] = [
    { key: 'nom', label: 'Nom', type: 'text' },
    { key: 'prenom', label: 'Prénom', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'mot_de_passe', label: 'Mot de passe', type: 'password' },
    { key: 'telephone', label: 'Téléphone', type: 'text' },
    { key: 'localisation', label: 'Localisation', type: 'text' },
    { key: 'role', label: 'role', type: 'text' },
  ];

  constructor(private service: ElevagesService, private toastr: ToastrService,private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
    this.LoadUsers();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
  }

  LoadUsers() {
    this.isLoading = true; // Active le
    this.spinner.show(); // Afficher le spinner

    this.service.LoadUsers().subscribe((item: User[]) => {
      this.userList = item;
      this.isLoading = false; // Désactive le spinner lorsque les données sont chargées
        this.spinner.hide();
      // Initialize DataTable if not already initialized
      this.reinitializeDataTable();
    });
  }

  // Initialize or reinitialize DataTable
  reinitializeDataTable() {
    if ($.fn.DataTable.isDataTable('#DataTables_Table_0')) {
      $('#DataTables_Table_0').DataTable().clear().destroy();
      
    }
    this.dtTrigger.next(null);

  }

  // Open the modal
  openModal() {
    const modalElement = document.getElementById('addUserModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // Submit the form to create a new user
  submitForm() {
    this.service.createUser(this.newUser).subscribe(
      () => {
        this.toastr.success('Utilisateur enregistré avec succès!', 'Succès');
        this.resetForm();
        this.closeModal();
        this.LoadUsers();
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement:', error);
        this.toastr.error('Échec de l\'enregistrement de l\'utilisateur.', 'Erreur');
      }
    );
  }

  // Reset the form
  resetForm() {
    this.newUser = { id_user: null, nom: '', prenom: '', email: '', mot_de_passe: '', telephone: '', localisation: '',role:[''] };
  }

  // Close the modal
  closeModal() {
    const modalElement = document.getElementById('addUserModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
  }

  // Confirm deletion of the user
  confirmDelete(id: any) {
    this.deleteUserId = id;
    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  updateUser(id: number, eleveur: any) {
    this.service.editUser(id, eleveur).subscribe(
      response => {
        // Traitement de la réponse après la mise à jour
        console.log('Éleveur mis à jour avec succès:', response);
        // Vous pouvez également rediriger ou mettre à jour l'UI
      },
      error => {
        // Gestion des erreurs
        console.error('Erreur lors de la mise à jour de l\'éleveur:', error);
        // Afficher un message d'erreur ou gérer l'affichage
      }
    );
  }

  // Delete the user
  deleteUser(id: any) {
    this.service.deleteUser(id).subscribe(
      () => {
        this.userList = this.userList.filter(user => user.id_user !== id);
        this.toastr.success('Utilisateur supprimé avec succès!', 'Succès');
        this.LoadUsers(); // Recharge la liste complète après suppression
        setTimeout(() => {
          this.reinitializeDataTable();
        }, 0);
      },
      (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.toastr.error('Échec de la suppression de l\'utilisateur.', 'Erreur');
      }
    );
  }
}
