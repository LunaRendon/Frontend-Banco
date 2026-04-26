import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { UsuarioService } from 'src/app/core/services/Usuario.service';
import { CreateUsuarioRequest, UpdateUsuarioRequest, Usuario } from 'src/app/shared/models/Usuario.model';

@Component({
    selector: 'app-usuario-crud',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, RippleModule, DialogModule, InputTextModule, ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule, CheckboxModule],
    templateUrl: './usuario-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class UsuarioListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    usuarios = signal<Usuario[]>([]);
    selectedUsuarios: Usuario[] = [];
    usuario!: Usuario;
    usuarioDialog = false;
    submitted = false;
    loading = false;

    constructor(
        private usuarioService: UsuarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadUsuarios();
    }

    loadUsuarios() {
        this.loading = true;
        this.usuarioService.getUsuarios({ page: 1, limit: 100 }).subscribe({
            next: (data) => {
                this.usuarios.set(data);
                this.loading = false;
            },
            error: (err) => {
                console.error('Error al cargar usuarios:', err);
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los usuarios'
                });
            }
        });
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.usuario = {
            id_usuario: '',
            id: '',
            nombre: '',
            nombre_usuario: '',
            email: '',
            telefono: '',
            activo: true,
            es_admin: false,
            fecha_creacion: new Date().toISOString(),
            contraseña: ''
        };
        this.submitted = false;
        this.usuarioDialog = true;
    }

    editUsuario(usuario: Usuario) {
        this.usuario = { ...usuario };
        this.usuarioDialog = true;
    }

    deleteUsuario(usuario: Usuario) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar al usuario "${usuario.nombre}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usuarioService.deleteUsuario(usuario.id_usuario).subscribe({
                    next: () => {
                        this.usuarios.set(this.usuarios().filter((u) => u.id_usuario !== usuario.id_usuario));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Eliminado',
                            detail: 'Usuario eliminado correctamente'
                        });
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
                const ids = this.selectedUsuarios.map((u) => u.id_usuario);
                this.usuarios.set(this.usuarios().filter((u) => !ids.includes(u.id_usuario)));
                this.selectedUsuarios = [];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Usuarios eliminados correctamente'
                });
            }
        });
    }

    hideDialog() {
        this.usuarioDialog = false;
        this.submitted = false;
    }

    saveUsuario() {
        this.submitted = true;
        if (!this.usuario.nombre?.trim() || !this.usuario.email?.trim()) return;

        if (this.usuario.id_usuario) {
            const updateReq: UpdateUsuarioRequest = {
                nombre: this.usuario.nombre,
                nombre_usuario: this.usuario.nombre_usuario,
                email: this.usuario.email,
                telefono: this.usuario.telefono,
                activo: this.usuario.activo,
                es_admin: this.usuario.es_admin
            };
            this.usuarioService.updateUsuario(this.usuario.id_usuario, updateReq).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualizado',
                        detail: 'Usuario actualizado correctamente'
                    });
                    this.loadUsuarios();
                    this.usuarioDialog = false;
                }
            });
        } else {
            const createReq: CreateUsuarioRequest = {
                nombre: this.usuario.nombre,
                nombre_usuario: this.usuario.nombre_usuario,
                email: this.usuario.email,
                contraseña: this.usuario.contraseña,
                telefono: this.usuario.telefono || undefined,
                es_admin: this.usuario.es_admin
            };
            this.usuarioService.createUsuario(createReq).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Creado',
                        detail: 'Usuario creado exitosamente'
                    });
                    this.loadUsuarios();
                    this.usuarioDialog = false;
                }
            });
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }
}
