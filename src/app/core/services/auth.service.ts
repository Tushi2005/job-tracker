import { signal, Injectable } from "@angular/core";
import { HttpClient, HttpBackend } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment.prod";


@Injectable({providedIn:"root"})
export class AuthService{
    private apiUrl = 'http://192.168.1.108:8080/api/auth';
    private http: HttpClient;
    currentUser = signal<string| null>(null);

    constructor(private handler: HttpBackend, private router:Router){
        this.http = new HttpClient(handler);
        const token = localStorage.getItem('token');
        if(token) this.currentUser.set(localStorage.getItem('fullName'))
        console.log('Environment:', environment);
console.log('API URL:', environment.apiUrl);
    }

    register(data: {email:string, password: string, fullName: string}){
        return this.http.post<{token:string, fullName: string, email:string}>(
            `${this.apiUrl}/register`, data
        )
    };

    login(data: {email:string, password: string}){
        return this.http.post<{token:string, fullName: string, email:string}>(
            `${this.apiUrl}/login`, data
        )
    };

    saveToken(token: string, fullName:string){
        localStorage.setItem('token', token);
        localStorage.setItem('fullName', fullName);
        this.currentUser.set(fullName);
        this.router.navigate(['/applications'])
    }

    isLoggedIn(): boolean{
        return !!localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }
}