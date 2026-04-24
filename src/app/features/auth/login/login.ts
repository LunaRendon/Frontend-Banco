import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppFloatingConfigurator } from 'src/app/shared/components/floating-configurator/floating-configurator';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    AppFloatingConfigurator
  ],
  templateUrl: './login.html'
})
export class Login {
  nombre_usuario = '';
  contrasena = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    const success = this.authService.login(this.nombre_usuario, this.contrasena);

    if (success) {
      const role = this.authService.getUserRole();
      this.router.navigate([role === 'admin' ? '/dashboard' : '/dashboard']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}
