import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-oauth-callback',
  template: '<p>Bejelentkezés folyamatban...</p>',
})
export class OAuthCallback implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const accessToken = this.route.snapshot.queryParamMap.get('accessToken');
    const refreshToken = this.route.snapshot.queryParamMap.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      this.authService.loadUserInfo().subscribe({
        next: (userInfo) => this.authService.saveUser(userInfo),
        error: () => this.router.navigate(['/login'])
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
