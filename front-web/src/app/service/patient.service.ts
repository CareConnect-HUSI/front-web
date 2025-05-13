import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8081/pacientes';

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

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      `${this.apiUrl}/registrar-paciente`,
      JSON.stringify(userData),
      { headers, responseType: 'text' }
    );
  }

  obtenerPacientePorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateEstado(id: string, estado: string): Observable<any> {
    return this.http.put(`/api/pacientes/${id}/estado`, { estado });
  }

  findActividadesPorDocumento(documento: string): Observable<any[]> {
    return this.http.get<any[]>(
      'http://localhost:8081/actividad-paciente-visita/por-documento/' +
        documento
    );
  }

  updatePaciente(id: number, paciente: any): Observable<any> {
    return this.http.put(
      `http://localhost:8081/pacientes/actualizar-paciente/${id}`,
      paciente
    );
  }

  getTiposIdentificacion() {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-identificacion`);
  }

  getTiposActividad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-actividad`);
  }

  findActividadPacienteVisitaPorID(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar/${id}`);
  }
  
}
