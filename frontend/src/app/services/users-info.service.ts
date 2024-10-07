import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersInfoService {

  private baseUrl = `${environment.apiUrl}/usersInfo`; // Your backend URL

  constructor(private http: HttpClient) {}

  getUsersInfo(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
    })
  }
  addUserInfo(userData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      },
    })
  }
}
