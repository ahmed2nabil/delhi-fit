import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    CommonModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule,
     MatCardModule, 
    RouterModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  signInForm: FormGroup;
  error$!: Observable<any>;
  constructor(private fb: FormBuilder) {
      this.signInForm = this.fb.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
  }
  onSubmit() {

  }
}