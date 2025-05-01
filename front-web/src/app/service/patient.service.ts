import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8081/pacientes';

  constructor(private http: HttpClient) { }

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
  
      return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers });
    }
  registrarPaciente(userData: any): Observable<any> {
    if (!userData || typeof userData !== 'object' || !userData.nombre) {
      return new Observable(observer => {
        observer.error({ error: { error: 'Datos inválidos: falta el campo nombre' } });
      });
    }

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/registrar-paciente`, JSON.stringify(userData), { headers, responseType: 'text' });
  }

  obtenerPacientePorId(id: number): Observable<any> {
    console.log('ID del paciente:', id);
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}


/*

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

  registrarEnfermera(userData: any): Observable<any> {
    
    if (!userData || typeof userData !== 'object' || !userData.nombre) {
      return new Observable(observer => {
        observer.error({ error: { error: 'Datos inválidos: falta el campo nombre' } });
      });
    }
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post(`${this.apiUrl}/registrar-enfermera`, JSON.stringify(userData), { headers, responseType: 'text' });
  }
  
  updateEnfermera(id: number, enfermeraData: any): Observable<any> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No hay token disponible.');
      return new Observable(observer => {
        observer.error('Token no disponible');
      });
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put(`${this.apiUrl}/${id}`, enfermeraData, { headers });
  }
  

}

*/