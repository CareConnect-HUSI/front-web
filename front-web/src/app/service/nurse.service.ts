import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private apiUrl = 'http://localhost:8080/nurses';

  constructor(private http: HttpClient) {}

  findAll(page: number, limit: number): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No hay token disponible.');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
  }
}
