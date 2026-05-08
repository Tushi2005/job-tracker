import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application } from '../models/applications.model';
import { environment } from '../../../environments/environment';

@Injectable({providedIn:'root'})
export class ApplicationService{
    private apiUrl = `${environment.apiUrl}/api/applications`;

    constructor(private http:HttpClient) {}

    getAll(){
        return this.http.get<Application[]>(this.apiUrl);
    }

    getCompanies(){
        return this.http.get<string[]>(`${this.apiUrl}/companies`)
    }

    getPositions(){
        return this.http.get<string[]>(`${this.apiUrl}/positions`)
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
        const patchDoc = Object.entries(data).map(([key, value]) => ({
            op: 'replace',
            path: `/${key}`,
            value
        }));
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, patchDoc);
    }
}