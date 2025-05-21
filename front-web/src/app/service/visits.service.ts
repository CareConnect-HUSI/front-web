import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Visita } from '../model/visit';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {
  private readonly apiUrl = 'http://localhost:8000'; // URL del backend

  constructor(private http: HttpClient) {}

  // Crear una nueva visita (POST /visitas)
  createVisit(visita: Visita): Observable<Visita> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Visita>(`${this.apiUrl}/visitas`, visita, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener visitas por ID de paciente (GET /visitas/paciente/{idPaciente})
  getVisitsByPaciente(idPaciente: number): Observable<Visita[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Visita[]>(`${this.apiUrl}/visitas/paciente/${idPaciente}`, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  getAllVisits(page: number, size: number, currentDate: String): Observable<{ content: Visita[] }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ content: Visita[] }>(`${this.apiUrl}/visitas?page=${page}&size=${size}&fechaVisita=${currentDate}`, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  getActividadVisitaPacienteById(id: number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/actividad-paciente-visita/${id}`, {headers}).pipe(
      catchError(this.handleError)
    );
  }
  

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}, Mensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  updateVisit(id: number, visita: Partial<Visita>): Observable<Visita> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Visita>(`${this.apiUrl}/visitas/${id}`, visita, {headers}).pipe(
      catchError(this.handleError)
    );
  }
  getVisitasByEnfermeraId(id: string): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/visitas/enfermera/${id}`, {headers});
  }
} 