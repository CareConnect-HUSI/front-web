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
    console.log(this.email, this.password);
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        localStorage.setItem('token', response);
        this.router.navigate(['/cronograma']);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        alert('Usuario o contraseña incorrectos');
      }
    );
  }
}
