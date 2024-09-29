import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

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
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }
  constructor() {}
  isDesktop = false;



  ngOnInit() {
    this.checkScreenSize();
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
}
