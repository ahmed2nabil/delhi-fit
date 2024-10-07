import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isDesktop: boolean = false; // You can change this based on your actual screen size logic
  isLoggedIn: boolean = false; // Change this based on your authentication logic
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }
  constructor(private router: Router, private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  checkUserAuthentication() {
    // For example, check the local storage or call a service
    const token = localStorage.getItem('authToken');
    this.isLoggedIn = !!token; // Set to true if token exists
}

  ngOnInit() {
    this.checkScreenSize();
    this.checkUserAuthentication();
  }

  private checkScreenSize() {
    this.isDesktop = window.innerWidth > 768;
  }
  scrollTo(sectionId: string) {
    const homeComponent = document.querySelector('app-home') as any;
    if (homeComponent && homeComponent.scrollTo) {
      homeComponent.scrollTo(sectionId);
    }
  }
  logout() {
      this.authService.logout();
      this.router.navigateByUrl('/login');
}
login() {
  // Logic to show login modal or redirect to login page
  this.router.navigateByUrl('/login');
}
}
