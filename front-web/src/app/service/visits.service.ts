import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Visita } from '../model/visit';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {
  private readonly apiUrl = 'http://localhost:8082/visitas'; // URL del backend

  constructor(private http: HttpClient) {}

  // Crear una nueva visita (POST /visitas)
  createVisit(visita: Visita): Observable<Visita> {
    return this.http.post<Visita>(this.apiUrl, visita).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener visitas por ID de paciente (GET /visitas/paciente/{idPaciente})
  getVisitsByPaciente(idPaciente: number): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiUrl}/paciente/${idPaciente}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllVisits(page: number, size: number, currentDate: String): Observable<Visita[]> {
    return this.http.get<Visita[]>(`${this.apiUrl}?page=${page}&size=${size}&${currentDate}`);
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
}