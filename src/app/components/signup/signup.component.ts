import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  otpForm: FormGroup;
  step: 'signup' | 'otp' = 'signup';
  userId: string | null = null;
  message: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', Validators.required],
      role: ['student', Validators.required]
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });
  }

  onSignup() {
    if (this.signupForm.invalid) {
      this.message = 'Please fill all required fields correctly.';
      return;
    }

    this.authService.signup(this.signupForm.value).subscribe({
      next: (res: any) => {
        this.userId = res.userId;
        this.step = 'otp';
        this.message = res.message || 'Signup successful! Enter the OTP sent to your email.';
      },
      error: (err: any) => {
        this.message = err.error?.message || 'Something went wrong!';
      }
    });
  }

  onVerifyOtp() {
    if (this.otpForm.invalid || !this.userId) {
      this.message = 'Please enter the OTP!';
      return;
    }

    this.authService.verifyOtp({ userId: this.userId, otp: this.otpForm.value.otp })
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'OTP verified successfully!';
          this.step = 'signup';
          this.signupForm.reset({ role: 'student' });
        },
        error: (err: any) => {
          this.message = err.error?.message || 'OTP verification failed!';
        }
      });
  }
}
