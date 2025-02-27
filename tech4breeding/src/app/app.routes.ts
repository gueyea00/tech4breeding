import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dash/dashboard/dashboard.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { HelpsComponent } from './pages/helps/helps.component';
import { UserAccountComponent } from './pages/user-account/user-account.component';
import { AdminAccountComponent } from './pages/admin-account/admin-account.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { GatewayComponent } from './pages/gateway/gateway.component';
import { AuthGuard } from './core/services/auth.guard'; // Importez votre garde de route
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { DetailsAnalyseComponent } from './pages/details-analyse/details-analyse.component';
import { CameraComponent } from './pages/camera/camera.component';
import { Dashboard2Component } from './pages/dash/dashboard2/dashboard2.component';
import { Dashboard3Component } from './pages/dash/dashboard3/dashboard3.component';
import { Dashboard4Component } from './pages/dash/dashboard4/dashboard4.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { UploadComponent } from './pages/upload/upload.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfilComponent },
  { path: 'settings', component: SettingsComponent},
  { path: 'user-account', component: UserAccountComponent },
  { path: 'admin-account', component: AdminAccountComponent, canActivate: [AuthGuard],data: { roles: ['admin'] } },
  { path: 'camera', component: CameraComponent},
  { path: 'help', component: HelpsComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent }, // Pas de garde pour cette route
  { path: 'gateway', component: GatewayComponent},
  { path: 'login', component: LoginComponent }, // Pas de garde pour la page de login
  { path: 'passwordForgot', component: ForgotPasswordComponent }, // Pas de garde pour la page de login
  { path: 'details-analyse', component: DetailsAnalyseComponent }, // Pas de garde pour la page de login
  { path: 'dashboard/eleveur', component: Dashboard3Component ,data: { roles: ['eleveur'] }}, // Pas de garde pour la page de login
  { path: 'dashboard/veterinaire', component: Dashboard4Component,data: { roles: ['veterinaire','admin'] } }, // Pas de garde pour la page de login
  { path: 'contact', component: ContactComponent }, // Pas de garde pour la page de login
  { path: 'accueil', component: AccueilComponent }, // Pas de garde pour la page de login
  { path: 'analyse', component: UploadComponent }, // Pas de garde pour la page de login

  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirection vers la page d'accueil pour toutes les autres routes inconnues
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
