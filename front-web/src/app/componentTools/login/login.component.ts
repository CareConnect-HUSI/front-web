import { AuthService } from 'src/app/service/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  role: string  = '';

  onSubmit(): void {
    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.email);
        this.router.navigate(['/cronograma']);
        this.isLoading = false;

        //Guardar token en el local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('email', response.email);
      },
      (error) => {
        this.isLoading = false;
        alert(error.error || 'Credenciales incorrectas');
      }
    );
  }
}
