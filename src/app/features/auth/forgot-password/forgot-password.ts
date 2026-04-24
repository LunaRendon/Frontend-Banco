import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppFloatingConfigurator } from 'src/app/shared/components/floating-configurator/floating-configurator';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    AppFloatingConfigurator
  ],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  email = '';
  mensaje = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  private generarContrasena(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  onSubmit(): void {
    this.error = '';
    this.mensaje = '';

    const users = this.authService.getAllUsers();
    const user = users.find(u => u.email === this.email);

    if (!user) {
      this.error = 'No se encontró ningún usuario con ese correo.';
      return;
    }

    const nuevaContrasena = this.generarContrasena();
    localStorage.setItem(`pwd_${user.nombre_usuario}`, btoa(nuevaContrasena));

    this.mensaje = `Tu nueva contraseña temporal es: ${nuevaContrasena}`;
    setTimeout(() => this.router.navigate(['/auth/login']), 5000);
  }

  volverALogin() {
    this.router.navigate(['/auth/login']);
  }
}
