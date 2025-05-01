import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'http://localhost:8087/actividad';

  constructor(private http: HttpClient) {}

  findAll(): Observable<any> {
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
    return this.http.get<any>(`${this.apiUrl}/ver-actividades`, { headers });

  }

  // registrarEnfermera(activityData: any): Observable<any> {
  //   if (!activityData || typeof activityData !== 'object' || !activityData.nombre) {
  //     return new Observable((observer) => {
  //       observer.error({
  //         error: { error: 'Datos inválidos: falta el campo nombre' },
  //       });
  //     });
  //   }

  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   return this.http.post(
  //     `${this.apiUrl}/registrar-enfermera`,
  //     JSON.stringify(userData),
  //     { headers, responseType: 'text' }
  //   );
  // }

  // updateEnfermera(id: number, enfermeraData: any): Observable<any> {
  //   const token = localStorage.getItem('token');

  //   if (!token) {
  //     console.error('No hay token disponible.');
  //     return new Observable((observer) => {
  //       observer.error('Token no disponible');
  //     });
  //   }

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   });

  //   return this.http.put(`${this.apiUrl}/${id}`, enfermeraData, { headers });
  // }
}
