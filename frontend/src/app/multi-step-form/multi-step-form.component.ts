import { Component,LOCALE_ID, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { UsersInfoService } from '../services/users-info.service';

export class ArabicDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    // Here you can customize how the date is displayed
    // Return the date formatted in Arabic, or use a library like date-fns
    return date.toLocaleDateString('ar-EG'); // Example for Arabic date format
  }
}
// Register Arabic locale
registerLocaleData(localeAr);
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
  providers: [
    { provide: LOCALE_ID, useValue: 'ar' }, // Set Arabic locale
    { provide: NativeDateAdapter, useClass: ArabicDateAdapter } // Use the custom Arabic date adapter

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
  today: Date;
  userSubmitted: boolean = false;
  totalSteps: number = 10;
  constructor(private fb: FormBuilder, private userInfoService: UsersInfoService) {
        // Set today's date
        this.today = new Date();
  }

  ngOnInit() {
    this.personalInfoForm = this.fb.group({
      name: ['', Validators.required],
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
    const userData = {
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
    this.userSubmitted = true;
    this.userInfoService
      .addUserInfo(userData)
      .subscribe(
        (response) => {
        },
        (error) => {
          this.userSubmitted = false;
        }
      );
  } else {
    this.userSubmitted = false;
  }
  }
  resetUserSubmit() {
    this.userSubmitted = false;
  }
}
