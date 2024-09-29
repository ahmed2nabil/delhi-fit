import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-multi-step-form',
  standalone: true,
  imports: [
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  templateUrl: './multi-step-form.component.html',
  styleUrl: './multi-step-form.component.css'
})
export class MultiStepFormComponent {
  personalInfoForm!: FormGroup;
  educationForm!: FormGroup;
  workExperienceForm!: FormGroup;
  skillsForm!: FormGroup;
  preferencesForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.educationForm = this.fb.group({
      educationLevel: ['', Validators.required],
      fieldOfStudy: ['', Validators.required]
    });

    this.workExperienceForm = this.fb.group({
      currentJobTitle: ['', Validators.required],
      yearsOfExperience: ['', [Validators.required, Validators.min(0)]],
      currentCompany: ['', Validators.required]
    });

    this.skillsForm = this.fb.group({
      primarySkills: ['', Validators.required],
      secondarySkills: [''],
      languages: [[], Validators.required]
    });

    this.preferencesForm = this.fb.group({
      preferredWorkEnvironment: ['', Validators.required],
      expectedSalary: ['', [Validators.required, Validators.min(0)]],
      willingToRelocate: [false]
    });
  }

  submitForm() {
    if (this.personalInfoForm.valid &&
        this.educationForm.valid &&
        this.workExperienceForm.valid &&
        this.skillsForm.valid &&
        this.preferencesForm.valid) {
      const formData = {
        ...this.personalInfoForm.value,
        ...this.educationForm.value,
        ...this.workExperienceForm.value,
        ...this.skillsForm.value,
        ...this.preferencesForm.value
      };
      console.log('Form submitted:', formData);
      // Here you would typically send the data to a server
    } else {
      console.log('Form is invalid');
    }
  }
}
