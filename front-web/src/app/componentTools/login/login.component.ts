import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Simulación de autenticación (conectar a backend si es necesario)
      if (email === 'admin@demo.com' && password === '123456') {
        localStorage.setItem('isLoggedIn', 'true'); // Guardar sesión
        this.router.navigate(['/header']); // Redirige al dashboard
      } else {
        alert('Credenciales incorrectas');
      }
    }
  }
}
