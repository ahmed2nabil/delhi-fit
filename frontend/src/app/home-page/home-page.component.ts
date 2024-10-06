import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    MatButtonModule, 
    MatCardModule
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  @ViewChild('homeSection', { static: true }) homeSection!: ElementRef;
  @ViewChild('aboutSection', { static: true }) aboutSection!: ElementRef;
  @ViewChild('contactSection', { static: true }) contactSection!: ElementRef;

  scrollTo(sectionId: string) {
    let sectionElement: ElementRef;
    switch (sectionId) {
      case 'home':
        sectionElement = this.homeSection;
        break;
      case 'about':
        sectionElement = this.aboutSection;
        break;
      case 'contact':
        sectionElement = this.contactSection;
        break;
      default:
        return;
    }
    sectionElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

}
