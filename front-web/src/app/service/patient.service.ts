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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/paciente/registrar-paciente`, JSON.stringify(userData), { headers, responseType: 'text' });
  }
  
}
