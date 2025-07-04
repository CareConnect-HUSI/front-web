import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {
   private apiUrl = 'http://localhost:8000/insumos';
  
    constructor(private http: HttpClient) {}
    
    getMedicamentosPorPaciente(id: number): Observable<any[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.get<any[]>(`${this.apiUrl}/medicamentos/${id}`, { headers });
    }
    addMedicamentoPorPaciente(medicamento: any): Observable<any> {
      //const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<any>(`${this.apiUrl}/agregar`, medicamento, { headers });
    }
    
    getInventarioCompletoPorPaciente(id: number) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any[]>(`${this.apiUrl}/inventario-paciente/${id}` , { headers });
    }

    updateCantidadMedicamento(id: number, cantidad: number) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.put(`http://localhost:8081/insumos/actualizar/${id}?cantidad=${cantidad}`, {headers});
    }
}
