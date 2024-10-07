import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials)
      .pipe(tap((response: any) => {
        localStorage.setItem('authToken', response.token);
        this.checkAuth()
      }));
  }
  // isAuthenticated(): boolean {
  //   return !!localStorage.getItem('authToken');
  // }
  private hasToken(): boolean {
    const token = localStorage.getItem('authToken'); // Assuming you store the token in local storage
    return !!token; // Returns true if token exists
  }
  checkTokenValidity(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    // Validate token logic (e.g., checking expiry)
    const payload = this.decodeToken(token);
    return !!payload && !this.isTokenExpired(payload.exp);
  }
  private decodeToken(token: string) {
    // Decode the token logic
    return JSON.parse(atob(token.split('.')[1]));
  }

  private isTokenExpired(expiration: number): boolean {
    return expiration * 1000 < Date.now(); // Compare expiration time
  }  
  logout() {
    localStorage.removeItem('authToken'); // Remove token on logout
    this.isAuthenticatedSubject.next(false); // Update auth status
  }

  checkAuth() {
    const isValid = this.checkTokenValidity();
    this.isAuthenticatedSubject.next(isValid);
  }
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
}
