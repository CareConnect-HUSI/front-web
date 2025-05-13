import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NurseService {
  private apiUrl = 'http://localhost:8088/enfermeras';

  constructor(private http: HttpClient) {}

  findAll(page: number, limit: number): Observable<any> {
    // const token = localStorage.getItem('token');

    // if (!token) {
    //   console.error('No hay token disponible.');
    //   return new Observable();
    // }

    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}`,
    //   'Content-Type': 'application/json'
    // });

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`, {
      headers,
    });
  }

  registrarEnfermera(userData: any): Observable<any> {
    if (!userData || typeof userData !== 'object' || !userData.nombre) {
      return new Observable((observer) => {
        observer.error({
          error: { error: 'Datos inválidos: falta el campo nombre' },
        });
      });
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      `${this.apiUrl}/registrar-enfermera`,
      JSON.stringify(userData),
      { headers, responseType: 'text' }
    );
  }

  updateEnfermera(id: number, enfermeraData: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No hay token disponible.');
      return new Observable((observer) => {
        observer.error('Token no disponible');
      });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.apiUrl}/${id}`, enfermeraData, { headers });
  }

  getLocalidades() {
    return this.http.get<any[]>('http://localhost:8088/enfermeras/localidades');
  }

  getBarriosPorLocalidad(codigoLocalidad: string) {
    return this.http.get<string[]>(
      `http://localhost:8088/enfermeras/barrios/${codigoLocalidad}`
    );
  }

  getBarriosPorNombre(nombre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nombre/${nombre}`);
  }

  getTiposIdentificacion() {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-identificacion`);
  }
}
