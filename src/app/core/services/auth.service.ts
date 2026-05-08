import { signal, Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';
import { switchMap } from "rxjs";

interface AuthResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

interface UserInfo {
  email: string;
  fullName: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private http: HttpClient;
  currentUser = signal<string | null>(null);

  constructor(private handler: HttpBackend, private router: Router) {
    this.http = new HttpClient(handler);
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) this.currentUser.set(localStorage.getItem('fullName'));
  }

  register(data: { email: string; password: string; fullName: string }) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, data).pipe(
      switchMap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return this.fetchUserInfo();
      })
    );
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login?useCookies=false&useSessionCookies=false`, data
    ).pipe(
      switchMap((response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return this.fetchUserInfo();
      })
    );
  }

  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/api/auth/google`;
  }

  loadUserInfo() {
    return this.fetchUserInfo();
  }

  private fetchUserInfo() {
    return this.http.get<UserInfo>(`${this.apiUrl}/api/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
  }

  saveUser(userInfo: UserInfo): void {
    localStorage.setItem('fullName', userInfo.fullName);
    this.currentUser.set(userInfo.fullName);
    this.router.navigate(['/applications']);
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('fullName');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
