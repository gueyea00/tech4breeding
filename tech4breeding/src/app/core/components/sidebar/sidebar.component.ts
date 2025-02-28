import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SidebarItem } from '../../../models/layout.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isSidebarVisible: boolean = false;
  cheminImage: any = "what.png";
  filteredMenu: SidebarItem[] = [];
  hashRole: { [key: string]: string[] } = {
    admin: ['admin'],
    client: ['client'],
    eleveur: ['eleveur'],
    veterinaire: ['veterinaire'],
  };

  sidebarItems: SidebarItem[] = [
    { label: 'Tableau de bord', icon: 'bi bi-house-door', link: '/dashboard', role: ['admin'] },
    { label: 'Tableau de bord', icon: 'bi bi-house-door', link: '/dashboard/veterinaire', role: ['veterinaire'] },
    { label: 'Tableau de bord', icon: 'bi bi-house-door', link: '/dashboard/eleveur', role: ['eleveur'] },
    { label: 'Compte', icon: 'bi bi-people', link: '/user-account', role: ['admin'] },
    { label: 'Profil', icon: 'bi bi-person', link: '/profile', role: ['admin', 'eleveur', 'veterinaire'] },
    { label: 'GateWays', icon: 'bi bi-activity', link: '/gateway', role: ['admin'] },
    // { label: 'Setting', icon: 'bi bi-gear-wide-connected', link: '/settings', role: ['admin'] },
    { label: 'Analyse', icon: 'bi bi-graph-up-arrow', link: '/analyse', role: ['admin', 'eleveur'] },
    { label: 'Camera', icon: 'bi bi-camera', link: '/camera', role: ['admin', 'eleveur'] },
    { label: 'Anomalies', icon: 'bi bi-exclamation-triangle', link: '/details-analyse', role: ['admin', 'veterinaire', 'eleveur'] },
    { label: 'Aide', icon: 'bi bi-patch-question', link: '/help', role: ['veterinaire', 'eleveur'] },
    { label: 'Rendez-vous', icon: 'bi bi-geo', link: '/contact', role: ['eleveur'] },
    { label: 'Deconnexion', icon: 'bi bi-door-closed', link: '/login', action: this.logout.bind(this), role: ['admin', 'veterinaire', 'eleveur'] }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.checkUserStatus();
    this.filterMenuByRole();
  }

  checkUserStatus() {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      
    }
    return false
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    const sidebarElement = document.querySelector('.sidebar');
    if (sidebarElement) {
      sidebarElement.classList.toggle('sidebar-hidden', !this.isSidebarVisible);
    }
  }

  toggleSubItems(item: SidebarItem): void {
    item.isOpen = !item.isOpen;
  }

  logout() {
    this.authService.removeToken();
    this.toastr.success('Déconnexion réussie', 'Au revoir!');
    this.router.navigate(['/login']);
  }

  filterMenuByRole(): void {
    const userRole = sessionStorage.getItem('userRole');
    const allowedRoles = this.hashRole[userRole || ''] || [];
    this.filteredMenu = this.sidebarItems.filter(item =>
      !item.role || item.role.some(role => allowedRoles.includes(role))
    );
  }
}
