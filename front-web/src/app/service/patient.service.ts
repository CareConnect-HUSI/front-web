import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  registerPatient(userData: any): Observable<any> {
        console.log("🔍 Revisando userData antes de enviarlo al backend:", userData);
      
        if (!userData || typeof userData !== 'object' || !userData.name) {
          return new Observable(observer => observer.error("Datos inválidos"));
        }
      
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      
        return this.http.post(`${this.apiUrl}/register-patient`, JSON.stringify(userData), { headers, responseType: 'text' });
      }
}
