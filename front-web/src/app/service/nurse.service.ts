import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private apiUrl = 'http://localhost:8080/nurses';

  constructor(private http: HttpClient) {}

  findAll(): Observable<any[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ No hay token disponible.');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map(response => response.data || [])
    );
  }
}
