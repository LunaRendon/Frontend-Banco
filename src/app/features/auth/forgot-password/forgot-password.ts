import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { HttpClient } from '@angular/common/http';
import { AppFloatingConfigurator } from 'src/app/shared/components/floating-configurator/floating-configurator';
import { environment } from 'src/environments/enviroment';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  username = '';
  nuevaContrasena = '';
  confirmContrasena = '';
  mensaje = '';
  error = '';
  cargando = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.username || !this.nuevaContrasena || !this.confirmContrasena) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.nuevaContrasena !== this.confirmContrasena) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;

    this.http.get<any>(`${environment.apiUrl}usuarios_app/username/${this.username}`).subscribe({
      next: (usuario) => {
        this.http.put(`${environment.apiUrl}usuarios_app/${usuario.id_usuario}`, {
          contraseña: this.nuevaContrasena
        }).subscribe({
          next: () => {
            this.mensaje = 'Contraseña actualizada exitosamente. Redirigiendo al login...';
            this.cargando = false;
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          },
          error: () => {
            this.error = 'Error al actualizar la contraseña.';
            this.cargando = false;
          }
        });
      },
      error: () => {
        this.error = 'No se encontró ningún usuario con ese nombre.';
        this.cargando = false;
      }
    });
  }
}