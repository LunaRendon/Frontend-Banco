import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { environment } from 'src/environments/enviroment';

interface UsuarioApp {
    id_usuario: string;
    username: string;
    estado: boolean;
    rol: string;
    id_cuenta?: string;
    fecha_registro: string;
}

@Component({
    selector: 'app-usuario-app-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, RippleModule,
        DialogModule, InputTextModule, ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule],
    templateUrl: './UsuarioApp-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UsuarioAppListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    usuarios = signal<UsuarioApp[]>([]);
    selectedUsuarios: UsuarioApp[] = [];
    usuario: UsuarioApp = this.emptyUsuario();
    usuarioDialog = false;
    submitted = false;
    loading = false;
    nuevaContrasena = '';

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() { this.loadUsuarios(); }

    emptyUsuario(): UsuarioApp {
        return { id_usuario: '', username: '', estado: true, rol: 'cliente', id_cuenta: '', fecha_registro: '' };
    }

    loadUsuarios() {
        this.loading = true;
        this.http.get<UsuarioApp[]>(`${environment.apiUrl}usuarios_app/`).subscribe({
            next: (data) => { this.usuarios.set(data || []); this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    editUsuario(u: UsuarioApp) {
        this.usuario = { ...u };
        this.nuevaContrasena = '';
        this.usuarioDialog = true;
    }

    deleteUsuario(u: UsuarioApp) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar al usuario "${u.username}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.http.delete(`${environment.apiUrl}usuarios_app/${u.id_usuario}`).subscribe({
                    next: () => {
                        this.usuarios.set(this.usuarios().filter(x => x.id_usuario !== u.id_usuario));
                        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Usuario eliminado' });
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
                    }
                });
            }
        });
    }

    deleteSelectedUsuarios() {
        this.confirmationService.confirm({
            message: '¿Eliminar los usuarios seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedUsuarios.map(u => u.id_usuario);
                this.usuarios.set(this.usuarios().filter(u => !ids.includes(u.id_usuario)));
                this.selectedUsuarios = [];
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuarios eliminados' });
            }
        });
    }

    hideDialog() { this.usuarioDialog = false; this.submitted = false; }

    saveUsuario() {
        this.submitted = true;
        if (!this.usuario.username?.trim()) return;

        const body: any = {
            username: this.usuario.username,
            estado: this.usuario.estado,
            rol: this.usuario.rol
        };
        if (this.nuevaContrasena) body.contraseña = this.nuevaContrasena;

        this.http.put(`${environment.apiUrl}usuarios_app/${this.usuario.id_usuario}`, body).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Usuario actualizado' });
                this.loadUsuarios();
                this.usuarioDialog = false;
            },
            error: (err) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.detail || 'No se pudo actualizar' });
            }
        });
    }
}