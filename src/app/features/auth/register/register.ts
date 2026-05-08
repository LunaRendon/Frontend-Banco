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
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './register.html'
})
export class Register {
    username = '';
    contrasena = '';
    confirmContrasena = '';
    id_cliente = '';
    mensaje = '';
    error = '';
    cargando = false;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {}

    onRegister() {
        this.error = '';
        this.mensaje = '';

        if (!this.username || !this.contrasena || !this.id_cliente) {
            this.error = 'Todos los campos son obligatorios.';
            return;
        }

        if (this.contrasena !== this.confirmContrasena) {
            this.error = 'Las contraseñas no coinciden.';
            return;
        }

        this.cargando = true;

        this.http
            .post(`${environment.apiUrl}usuarios_app/`, {
                username: this.username,
                contraseña: this.contrasena,
                estado: true,
                rol: 'cliente',
                id_cliente: this.id_cliente
            })
            .subscribe({
                next: () => {
                    this.mensaje = 'Usuario creado exitosamente. Redirigiendo al login...';
                    setTimeout(() => this.router.navigate(['/auth/login']), 2000);
                },
                error: (err) => {
                    this.error = err.error?.detail || 'Error al crear el usuario.';
                    this.cargando = false;
                }
            });
    }
}
