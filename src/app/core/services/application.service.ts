import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application } from '../models/applications.model';

@Injectable({providedIn:'root'})
export class ApplicationService{
    private apiUrl = 'https://localhost:7194/api/applications';

    constructor(private http:HttpClient) {}

    getAll(){
        return this.http.get<Application[]>(this.apiUrl);
    }

    getById(id: number){
        return this.http.get<Application>(`${this.apiUrl}/${id}`);
    }

    create(data: Partial<Application>){
        return this.http.post<Application>(this.apiUrl, data);
    }

    update(id: number, data: Partial<Application>){
        return this.http.put<Application>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number){
        return this.http.delete<Application>(`${this.apiUrl}/${id}`);
    }

    patch(id: number, data: Partial<Application>) {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, data);
    }
}