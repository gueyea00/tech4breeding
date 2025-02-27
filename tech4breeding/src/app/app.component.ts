import { Component } from '@angular/core';
import { HeaderComponent } from "./core/components/header/header.component";
import { SidebarComponent } from "./core/components/sidebar/sidebar.component";
import { ActivatedRoute, Router, RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, RouterModule, SidebarComponent, HeaderComponent, CommonModule],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hideHeaderAndSidebar: boolean = false;
isAuthPage: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (this.router.url === '/login' || this.router.url==='/passwordForgot' || this.router.url==='/register') {
        this.hideHeaderAndSidebar = true;
      } else {
        this.hideHeaderAndSidebar = false;
      }
    });
  }
}
