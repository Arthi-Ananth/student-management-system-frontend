import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUserRole() {
    throw new Error('Method not implemented.');
  }

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  signup(data: any) {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.apiUrl}/verify-otp`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

}
