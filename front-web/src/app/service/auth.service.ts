import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseApiUrl;
  private secretKey = 'contrasena1345678';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log(email
      , password
    );
    const encryptedPassword = this.encrypt(password);
    console.log(encryptedPassword);
    const body = JSON.stringify({ email, password });

    return this.http.post(this.apiUrl + '/login', body, { headers, responseType: 'text' });
  }

    registerNurse(userData: any): Observable<any> {
      console.log("🔍 Revisando userData antes de enviarlo al backend:", userData);
    
      if (!userData || typeof userData !== 'object' || !userData.name) {
        return new Observable(observer => observer.error("Datos inválidos"));
      }
    
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
      return this.http.post(`${this.apiUrl}/register-nurse`, JSON.stringify(userData), { headers, responseType: 'text' });
    }
    
    

  registerPatient(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(userData);
    console.log(body);
    return this.http.post(`${this.apiUrl}/register-patient`, body, { headers, responseType: 'text' });
  }

  private encrypt(password: string): string {
    let encrypted = '';
    for (let i = 0; i < password.length; i++) {
      encrypted += String.fromCharCode(password.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length));
    }
    return btoa(encrypted);
  }
}
