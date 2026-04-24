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
  selector: 'app-register',
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
  templateUrl: './register.html'
})
export class Register {
  nombre = '';
  nombre_usuario = '';
  email = '';
  telefono = '';
  password = '';
  confirmPassword = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.message = 'Las contraseñas no coinciden.';
      return;
    }

    const usuario = {
      id_usuario: '',
      id: '',
      nombre: this.nombre,
      nombre_usuario: this.nombre_usuario,
      email: this.email,
      telefono: this.telefono,
      activo: true,
      es_admin: false,
      fecha_creacion: '',
      fecha_edicion: '',
      contraseña: ''
    };

    const success = this.authService.registerUser(usuario, this.password);

    if (success) {
      this.message = 'Registro exitoso. Redirigiendo al login...';
      setTimeout(() => this.router.navigate(['/auth/login']), 1500);
    } else {
      this.message = 'El usuario o correo ya está registrado.';
    }
  }
}
