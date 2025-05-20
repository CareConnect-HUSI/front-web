import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  private apiUrl = 'http://localhost:8000/actividad';

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

  registrarActividad(producto: any): Observable<any> {
    // Mapear el objeto Producto al formato esperado por el backend
    const actividad = {
      name: producto.nombre,
      tipoActividad: { id: producto.tipo.id },
      descripcion: producto.descripcion || '',
      estado: 'Activo',
      cantidad: 0, // Valor por defecto, ajusta según necesidades
      usuarioRegistra: 'admin', // Ajusta según autenticación
    };

    return this.http.post(`${this.apiUrl}/registrar-actividad`, actividad).pipe(
      catchError((error) => {
        console.error('Error al registrar actividad:', error);
        return throwError(
          () => new Error(error.message || 'Error en el servidor')
        );
      })
    );
  }

  eliminarActividad(id: number): Observable<any> {
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.patch(`${this.apiUrl}/eliminar/${id}`,{}, { headers });
  }

  getListaMedicamentos(): Observable<any[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any[]>(`${this.apiUrl}/ver-actividades`, { headers });
  }
}
