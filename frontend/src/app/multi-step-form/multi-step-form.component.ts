import { Component, LOCALE_ID, ChangeDetectionStrategy, OnInit, AfterViewInit, effect } from '@angular/core';
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
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

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
export class MultiStepFormComponent implements OnInit {
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
  trainerId: string = '';
  fitnessPlanOptions: { value: string; label: string; arabicLabel: string }[] = [];
  showFitnessPlan: boolean = false;
  constructor(
    private fb: FormBuilder, 
    private userInfoService: UsersInfoService,
    private route: ActivatedRoute
  ) 
  {
    // Set today's date
    this.today = new Date();
  }

  ngOnInit() {
    this.personalInfoForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      height: ['', Validators.required],
      gender: ['', Validators.required],
    });

    this.fitnessGoalsForm = this.fb.group({
      fitnessGoal: ['', Validators.required],
      fitnessGoalText: [''],
      fitnessLevel: ['', Validators.required],
      fitnessFavPlanOther: ['']
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
      previousExperience: ['', Validators.required],
      fitnessFavPlan: [''],
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
      squatRating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      deadliftRating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      benchPressRating: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      pullUpRating: ['', [Validators.required, Validators.min(0), Validators.max(5)]]
    });

    this.additionalInfoForm = this.fb.group({
      additionalInfo: [''],
      referralSource: ['', Validators.required]
    });

    this.trainerId = this.route.snapshot.params['trainerId'];
    // Watch for changes in relevant form controls
    this.personalInfoForm.get('gender')?.valueChanges.subscribe(() => {
      this.updateFitnessPlanOptions();
    });

    this.workoutDetailsForm.get('workoutDaysPerWeek')?.valueChanges.subscribe(() => {
      this.updateFitnessPlanOptions();
    });

    this.workoutDetailsForm.get('workoutLocation')?.valueChanges.subscribe(() => {
      this.updateFitnessPlanOptions();
    });

    this.fitnessGoalsForm.get('fitnessGoal')?.valueChanges.subscribe(() => {
      this.updateFitnessPlanOptions();
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
      ...this.additionalInfoForm.value,
      trainerId: this.trainerId
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
  private updateFitnessPlanOptions() {
    const gender = this.personalInfoForm.get('gender')?.value;
    const daysPerWeek = this.workoutDetailsForm.get('workoutDaysPerWeek')?.value;
    const location = this.workoutDetailsForm.get('workoutLocation')?.value;
    const goal = this.fitnessGoalsForm.get('fitnessGoal')?.value;

    // Reset options
    this.fitnessPlanOptions = [];

    // First determine if we should show the fitness plan
    let result = this.shouldShowFitnessPlan(gender, daysPerWeek, location, goal);
    this.fitnessPlanOptions = result.availableOptions
    this.showFitnessPlan = result.showFitnessPlan


    // Example conditions - modify according to your needs
      // this.fitnessPlanOptions = availableOptions;
    // Add more conditions as needed

    // Always add the "other" option
    // this.fitnessPlanOptions.push({
    //   value: 'other',
    //   label: 'Other',
    //   arabicLabel: 'شئ اخر مع ذكره'
    // });

    // If no options were added based on conditions, hide the fitness plan
    if (this.fitnessPlanOptions.length === 0) {
      this.showFitnessPlan = false;
    }
  }
  private shouldShowFitnessPlan(
    gender: string, 
    daysPerWeek: number, 
    location: string, 
    goal: string
  ): FitnessPlanResult {
    const defaultResult: FitnessPlanResult = {
      showFitnessPlan: false,
      availableOptions: []
    };
    // Default options that should always be available
    let allAvailableOptions = [
      { value: 'pushPullLeg', label: 'push pull leg', arabicLabel: 'دفع سحب ارجل' },
      { value: 'fullBody', label: 'full body', arabicLabel: 'فل بودي' },
      { value: 'upperLower', label: 'upper lower', arabicLabel: 'علوي سفلي' },
      { value: 'upper', label: 'Upper Focus', arabicLabel: 'تركيز علي الجزء العلوي' },
      { value: 'lower', label: 'Lower Focus', arabicLabel: 'تركيز علي الجزء السفلي' }
    ];
    let availableOptions: AvailableOption[] = [];
    // Return false if any required value is missing
    if (!gender || !daysPerWeek || !location || !goal) {
      return defaultResult;
    }

    // Add  conditions for hiding the fitness plan
    // 3 days plan conditions 
    if (daysPerWeek === 3 && gender === 'man' && location === 'gym' && goal === 'muscleBuilding') {
      availableOptions.push(allAvailableOptions[1]) // full body; 
      availableOptions.push(allAvailableOptions[3]) // upper; 
    }
    if (daysPerWeek === 3 && gender === 'woman' && location === 'gym' && goal === 'muscleBuilding') {
      availableOptions.push(allAvailableOptions[1]) // full body; 
      availableOptions.push(allAvailableOptions[4]) // lower; 
    }
    
    // 4 days conditions 
    if (daysPerWeek === 4 && gender === 'man'  && goal === 'muscleBuilding') {
      availableOptions.push(allAvailableOptions[2]) // upper lower; 
      availableOptions.push(allAvailableOptions[3]) // upper; 
    }
    if (daysPerWeek === 4 && gender === 'woman'  && goal === 'muscleBuilding') {
      availableOptions.push(allAvailableOptions[2]) // upper lower; 
      availableOptions.push(allAvailableOptions[4]) // lower; 
    }    
    // 5 days conditions
    if (daysPerWeek === 5) {
      availableOptions.push(allAvailableOptions[1]) // full body; 
      availableOptions.push(allAvailableOptions[0]) // push pull leg; 
    }
    return {
      showFitnessPlan: availableOptions.length > 0,
      availableOptions
    };;
  }
}

interface FitnessPlanResult {
  showFitnessPlan: boolean;
  availableOptions: AvailableOption[];
}
interface AvailableOption {
  value: string;
  label: string;
  arabicLabel: string;
}
