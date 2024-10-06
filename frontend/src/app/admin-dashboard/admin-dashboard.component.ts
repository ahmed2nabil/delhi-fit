import { Component, OnInit} from '@angular/core';
import { UsersInfoService } from '../services/users-info.service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  usersInfo: any[] = [];
  expandedElement: any | null;

  constructor(private usersInfoService: UsersInfoService) {}

  ngOnInit(): void {
    
  }

  loadRecords() {
    this.usersInfoService.getUsersInfo().subscribe(
      (data) => {
        this.usersInfo = data;
      },
      (error) => {
        console.error('Error fetching records', error);
      }
    );
  }
}
