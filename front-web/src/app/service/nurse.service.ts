import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NurseService {
  private apiUrl = 'http://localhost:8000/enfermeras';

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

    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

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

    //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(
      `${this.apiUrl}/registrar-enfermera`,
      JSON.stringify(userData),
      { headers, responseType: 'text' }
    );
  }

  updateEnfermera(id: number, enfermeraData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (!token) {
      console.error('No hay token disponible.');
      return new Observable((observer) => {
        observer.error('Token no disponible');
      });
    }

    return this.http.put(`${this.apiUrl}/${id}`, enfermeraData, { headers });
  }

  getLocalidades() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/localidades`, { headers });
  }

  getBarriosPorLocalidad(codigoLocalidad: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<string[]>(`${this.apiUrl}/barrios/${codigoLocalidad}`, {
      headers});
  }

  getBarriosPorNombre(nombre: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/nombre/${nombre}`, { headers });
  }

  getTiposIdentificacion() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/tipos-identificacion`, { headers });
  }
}
