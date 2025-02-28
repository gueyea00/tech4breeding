import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { HelpsComponent } from './helps/helps.component';
import { DashboardComponent } from './dash/dashboard/dashboard.component';
import { GatewayComponent } from './gateway/gateway.component';
import { DetailsAnalyseComponent } from './details-analyse/details-analyse.component';
import { CameraComponent } from './camera/camera.component';
import { Dashboard2Component } from './dash/dashboard2/dashboard2.component';
import { Dashboard3Component } from './dash/dashboard3/dashboard3.component';
import { Dashboard4Component } from './dash/dashboard4/dashboard4.component';
import { ContactComponent } from './contact/contact.component';
import {NgxSpinnerComponent} from 'ngx-spinner';
import {ReactiveFormsModule} from '@angular/forms';
import { AccueilComponent } from './accueil/accueil.component';
import { UploadComponent } from './upload/upload.component';  // Importez directement le composant ici

@NgModule({
  declarations: [
     GatewayComponent,

     AccueilComponent,


  ],
  imports: [
    CommonModule,
    RouterModule,
    DashboardComponent,
    SettingsComponent,
    HelpsComponent,
    NgxSpinnerComponent,
    ReactiveFormsModule,

    // Ajoutez simplement le composant standalone ici
  ],
  exports: [
    SettingsComponent,
    HelpsComponent,
    DashboardComponent  // Vous pouvez aussi l'exporter si nécessaire
  ]
})
export class PagesModule {}
