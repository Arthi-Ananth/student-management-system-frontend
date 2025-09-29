import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.message = 'Please fill all required fields';
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const role = res.user.role;

        // ✅ Save token and role in localStorage
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', role);

        // redirect based on role
        if (role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (role === 'teacher') {
          this.router.navigate(['/teacher-dashboard']);
        } else if (role === 'student') {
          this.router.navigate(['/student-dashboard']);
        }

        this.message = 'Login successful!';
      },

      error: (err: any) => {
        this.message = err.error?.message || 'Invalid credentials!';
      }
    });
  }
}
