import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Usuario } from 'src/app/shared/models/Usuario.model';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
    usuario: Usuario | null = null;
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.usuario = this.authService.getCurrentUser();
    }
}
