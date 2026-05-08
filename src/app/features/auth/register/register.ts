import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onGoogleLogin(): void {
    this.authService.loginWithGoogle();
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Kérlek töltsd ki helyesen a regisztrációs űrlapot.';
      return;
    }

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register({ fullName: fullName!, email: email!, password: password! })
      .subscribe({
        next: (userInfo) => {
          this.authService.saveUser(userInfo);
          this.errorMessage = null;
        },
        error: (err) => {
          console.error('Register error', err);
          if (err.status === 409) {
            this.errorMessage = 'Ez az email cím már regisztrálva van.';
          } else {
            this.errorMessage = 'Regisztráció sikertelen. Próbáld újra később.';
          }
        }
      });
  }
}
