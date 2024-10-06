import { Component, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrl: './multi-step-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiStepFormComponent {
  personalInfoForm!: FormGroup;
  fitnessGoalsForm!: FormGroup;
  workoutDetailsForm!: FormGroup;
  occupationForm!: FormGroup;
  experienceForm!: FormGroup;
  healthForm!: FormGroup;
  dietForm!: FormGroup;
  exerciseRatingForm!: FormGroup;
  additionalInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.personalInfoForm = this.fb.group({
      age: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      height: ['', Validators.required]
    });

    this.fitnessGoalsForm = this.fb.group({
      fitnessGoal: ['', Validators.required],
      fitnessLevel: ['', Validators.required]
    });

    this.workoutDetailsForm = this.fb.group({
      workoutLocation: ['', Validators.required],
      homeEquipment: [''],
      workoutDaysPerWeek: ['', Validators.required],
      workoutHoursPerDay: ['', Validators.required],
      preferredWorkoutDays: [[], Validators.required]
    });

    this.occupationForm = this.fb.group({
      currentOccupation: [''],
      jobNature: ['', Validators.required]
    });

    this.experienceForm = this.fb.group({
      previousExperience: ['', Validators.required]
    });

    this.healthForm = this.fb.group({
      chronicDiseases: [''],
      injuries: [''],
      supplements: ['']
    });

    this.dietForm = this.fb.group({
      mealPreparation: ['', Validators.required],
      dietMethod: [''],
      dailyDiet: ['', Validators.required],
      foodAllergies: [''],
      favoriteFoods: ['']
    });

    this.exerciseRatingForm = this.fb.group({
      squatRating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      deadliftRating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      benchPressRating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      pullUpRating: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });

    this.additionalInfoForm = this.fb.group({
      additionalInfo: [''],
      referralSource: ['', Validators.required]
    });
  }

  submitForm() {
    if (this.personalInfoForm.valid &&
      this.fitnessGoalsForm.valid &&
      this.workoutDetailsForm.valid &&
      this.occupationForm.valid &&
      this.experienceForm.valid &&
      this.healthForm.valid &&
      this.dietForm.valid &&
      this.exerciseRatingForm.valid &&
      this.additionalInfoForm.valid) {
    const formData = {
      ...this.personalInfoForm.value,
      ...this.fitnessGoalsForm.value,
      ...this.workoutDetailsForm.value,
      ...this.occupationForm.value,
      ...this.experienceForm.value,
      ...this.healthForm.value,
      ...this.dietForm.value,
      ...this.exerciseRatingForm.value,
      ...this.additionalInfoForm.value
    };
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
  } else {
    console.log('Form is invalid');
  }
  }
}
