import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  onGoogleLogin(): void {
    this.authService.loginWithGoogle();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Kérlek töltsd ki helyesen az űrlapot!';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (userInfo) => {
        this.authService.saveUser(userInfo);
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Hibás jelszó vagy email!';
      }
    });
  }
}
