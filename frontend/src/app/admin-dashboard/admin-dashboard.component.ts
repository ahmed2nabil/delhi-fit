import { Component, OnInit} from '@angular/core';
import { UsersInfoService } from '../services/users-info.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatTableModule, MatExpansionModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  usersInfo: any[] = [];
  usersInfoDataSource =new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'age', 'dateOfBirth', 'height'];
  expandedElement: any | null = null;

  toggleRow(row: any) {
    this.expandedElement = this.expandedElement === row ? null : row;
  }
  constructor(private usersInfoService: UsersInfoService) {}

  ngOnInit(): void {
    this.loadUsersInfoData()
  }

  loadUsersInfoData() {
    this.usersInfoService.getUsersInfo().subscribe(
      (data) => {
        this.usersInfo = data;
      },
      (error) => {
        console.error('Error fetching records', error);
      }
    );
  }
  getArabicHeader(column: string): string {
    const headers: { [key: string]: string } = {
      name: 'الاسم',
      age: 'العمر',
      dateOfBirth: 'تاريخ الميلاد',
      height: 'الطول',
      fitnessGoal: 'هدف اللياقة البدنية',
      fitnessLevel: 'مستوى اللياقة البدنية',
      workoutLocation: 'مكان التمرين',
      homeEquipment: 'معدات المنزل',
      workoutDaysPerWeek: 'أيام التمرين في الأسبوع',
      preferredWorkoutDays: 'الأيام المفضلة للتمرين',
      jobNature: 'طبيعة العمل',
      chronicDiseases: 'الأمراض المزمنة',
      squatRating: 'تقييم القرفصاء',
      deadliftRating: 'تقييم رفع الأثقال',
      referralSource: 'مصدر الإحالة'
    };
    return headers[column] || column; // Return the Arabic name or the original if not found
  }
}