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
import { BancoService } from 'src/app/core/services/Banco.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ClienteService } from 'src/app/core/services/Cliente.service';
import { Cliente, CreateClienteRequest, UpdateClienteRequest } from 'src/app/shared/models/Cliente.model';

@Component({
    selector: 'app-cliente-crud',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, RippleModule, DialogModule, InputTextModule, ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule, CheckboxModule],
    templateUrl: './Cliente-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ClienteListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    clientes: Cliente[] = [];
    selectedClientes: Cliente[] = [];
    cliente: Cliente = {
        codigo: '',
        nombre: '',
        id: '',
        num_documento: '',
        tipo_documento: '',
        telefono: '',
        direccion: '',
        correo: '',
        id_banco: '',
        fecha_creacion: new Date().toISOString()
    };
    clienteDialog: boolean = false;
    submitted: boolean = false;
    loading: boolean = false;

    bancos: any[] = [];
    id_banco = '';

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private bancoService: BancoService
    ) {}

    ngOnInit() {
        this.loadClientes();
    }

    loadClientes() {
        this.loading = true;
        this.bancoService.getBancos({ page: 1, limit: 100 }).subscribe({
            next: (bancos: any[]) => {
                this.bancos = bancos || [];
                if (this.bancos.length > 0) {
                    this.id_banco = this.bancos[0].id_banco;
                }
                const peticiones = this.bancos.map((banco) => this.clienteService.getClientes(banco.id_banco, { page: 1, limit: 100 }));

                let todosClientes: any[] = [];
                let completadas = 0;

                if (peticiones.length === 0) {
                    this.loading = false;
                    return;
                }

                peticiones.forEach((peticion) => {
                    peticion.subscribe({
                        next: (clientes: any[]) => {
                            todosClientes = [...todosClientes, ...(clientes || [])];
                            completadas++;
                            if (completadas === peticiones.length) {
                                this.clientes = todosClientes;
                                this.loading = false;
                            }
                        },
                        error: () => {
                            completadas++;
                            if (completadas === peticiones.length) {
                                this.clientes = todosClientes;
                                this.loading = false;
                            }
                        }
                    });
                });
            },
            error: () => {
                this.loading = false;
            }
        });
    }
    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.cliente = {
            codigo: '',
            nombre: '',
            id: '',
            num_documento: '',
            tipo_documento: '',
            telefono: '',
            direccion: '',
            correo: '',
            id_banco: this.id_banco,
            fecha_creacion: new Date().toISOString()
        };
        this.submitted = false;
        this.clienteDialog = true;
    }

    editCliente(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.clienteDialog = true;
    }

    deleteCliente(cliente: Cliente) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar al cliente "${cliente.nombre}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.clienteService.deleteCliente(this.id_banco, cliente.codigo).subscribe({
                    next: () => {
                        this.clientes = this.clientes.filter((c) => c.codigo !== cliente.codigo);
                        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado correctamente' });
                    }
                });
            }
        });
    }

    deleteSelectedClientes() {
        this.confirmationService.confirm({
            message: '¿Eliminar los clientes seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedClientes.map((c) => c.codigo);
                this.clientes = this.clientes.filter((c) => !ids.includes(c.codigo));
                this.selectedClientes = [];
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Clientes eliminados' });
            }
        });
    }

    hideDialog() {
        this.clienteDialog = false;
        this.submitted = false;
    }

    saveCliente() {
        this.submitted = true;
        if (!this.cliente.nombre?.trim()) return;

        if (this.cliente.codigo) {
            const updateReq: UpdateClienteRequest = {
                nombre: this.cliente.nombre,
                num_documento: this.cliente.num_documento,
                tipo_documento: this.cliente.tipo_documento,
                telefono: this.cliente.telefono,
                direccion: this.cliente.direccion,
                correo: this.cliente.correo,
                id_banco: this.id_banco
            };
            this.clienteService.updateCliente(this.id_banco, this.cliente.codigo, updateReq).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Cliente actualizado correctamente' });
                    this.loadClientes();
                    this.clienteDialog = false;
                }
            });
        } else {
            const createReq: CreateClienteRequest = {
                id_banco: this.id_banco,
                nombre: this.cliente.nombre,
                num_documento: this.cliente.num_documento,
                tipo_documento: this.cliente.tipo_documento,
                telefono: this.cliente.telefono,
                direccion: this.cliente.direccion,
                correo: this.cliente.correo
            };
            this.clienteService.createCliente(createReq).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Creado', detail: 'Cliente creado exitosamente' });
                    this.loadClientes();
                    this.clienteDialog = false;
                }
            });
        }
    }

    exportCSV() {
        this.dt.exportCSV();
    }
}
