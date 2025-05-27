import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8000/pacientes';
  private apiUrlActividad ='http://localhost:8000/actividad-paciente-visita';

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
    
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${limit}`, {
      headers,
    });
  }
  registrarPaciente(userData: any): Observable<any> {
    if (!userData || typeof userData !== 'object' || !userData.nombre) {
      return new Observable((observer) => {
        observer.error({
          error: { error: 'Datos inválidos: falta el campo nombre' },
        });
      });
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/registrar-paciente`, JSON.stringify(userData), { headers, responseType: 'text' });
  }

  obtenerPacientePorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  updateEstado(id: string, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`/api/pacientes/${id}/estado`, { estado }, { headers });
  }

  findActividadesPorDocumento(documento: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrlActividad}/listar/por-documento/${documento}`, { headers });
  }

  getTratamientosPorId(id: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/listar/${id}`, { headers });
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/actualizar-paciente/${id}`, paciente, { headers });
  }

  getTiposIdentificacion() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/tipos-identificacion`, { headers });
  }

  getTiposActividad(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/tipos-actividad`, { headers });
  }

  findActividadPacienteVisitaPorID(id: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/listar/${id}`, {headers});
  }
  updateTratamiento(id: number, tratamiento: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrlActividad}/actualizar/${id}`, tratamiento, { headers });
  }

  getLocalidades() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/localidades`, { headers });
  }

  getBarriosPorLocalidad(codigoLocalidad: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<string[]>(`${this.apiUrl}/barrios/${codigoLocalidad}`, { headers });
  }

  registrarTratamiento(payload: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrlActividad}/registrar`, payload, { headers });
  }
}
