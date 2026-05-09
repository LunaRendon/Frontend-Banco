import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { AuthService } from 'src/app/core/services/auth.service';
import { CuentaService } from 'src/app/core/services/Cuenta.service';
import { ClienteService } from 'src/app/core/services/Cliente.service';
import { BancoService } from 'src/app/core/services/Banco.service';
import { Cuenta, CreateCuentaRequest, UpdateCuentaRequest } from 'src/app/shared/models/Cuenta.model';

@Component({
    selector: 'app-Cuenta-crud',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, RippleModule,
        DialogModule, InputTextModule, ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule],
    templateUrl: './Cuenta-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class CuentaListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    cuentas = signal<Cuenta[]>([]);
    selectedCuentas: Cuenta[] = [];
    cuenta: Cuenta = {
        id_cuenta: '',
        numero_cuenta: '',
        tipo_cuenta: '',
        saldo: 0,
        fecha_apertura: new Date().toISOString().split('T')[0],
        estado: true,
        id_cliente: '',
        fecha_creacion: new Date().toISOString()
    };
    clientes: any[] = [];
    cuentaDialog = false;
    submitted = false;
    loading = false;

    constructor(
        private cuentaService: CuentaService,
        private clienteService: ClienteService,
        private bancoService: BancoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public authService: AuthService
    ) {}

    ngOnInit() {
        this.loadCuentas();
        this.loadClientes();
    }

    loadCuentas() {
    this.loading = true;
    this.bancoService.getBancos({ page: 1, limit: 100 }).subscribe({
        next: (bancos: any[]) => {
            if (!bancos || bancos.length === 0) { this.loading = false; return; }
            let todosClientes: any[] = [];
            let bancosCompletados = 0;

            bancos.forEach(banco => {
                this.clienteService.getClientes(banco.id_banco, { page: 1, limit: 100 }).subscribe({
                    next: (clientes: any[]) => {
                        todosClientes = [...todosClientes, ...(clientes || [])];
                        bancosCompletados++;
                        if (bancosCompletados === bancos.length) {
                            // Deduplicar clientes
                            const clientesUnicos = Array.from(
                                new Map(todosClientes.map(c => [c.id_cliente, c])).values()
                            );
                            this.cargarCuentasPorClientes(clientesUnicos);
                        }
                    },
                    error: () => {
                        bancosCompletados++;
                        if (bancosCompletados === bancos.length) {
                            const clientesUnicos = Array.from(
                                new Map(todosClientes.map(c => [c.id_cliente, c])).values()
                            );
                            this.cargarCuentasPorClientes(clientesUnicos);
                        }
                    }
                });
            });
        },
        error: () => { this.loading = false; }
    });
}

cargarCuentasPorClientes(clientes: any[]) {
    let todasCuentas: Cuenta[] = [];
    let completadas = 0;
    if (clientes.length === 0) { this.loading = false; return; }

    clientes.forEach(c => {
        this.cuentaService.getCuentasByCliente(c.id_cliente).subscribe({
            next: (cuentas: Cuenta[]) => {
                todasCuentas = [...todasCuentas, ...(cuentas || [])];
                completadas++;
                if (completadas === clientes.length) {
                    const unique = Array.from(
                        new Map(todasCuentas.map(c => [c.id_cuenta, c])).values()
                    );
                    this.cuentas.set(unique);
                    this.loading = false;
                }
            },
            error: () => {
                completadas++;
                if (completadas === clientes.length) {
                    const unique = Array.from(
                        new Map(todasCuentas.map(c => [c.id_cuenta, c])).values()
                    );
                    this.cuentas.set(unique);
                    this.loading = false;
                }
            }
        });
    });
}

    loadClientes() {
        this.bancoService.getBancos({ page: 1, limit: 100 }).subscribe({
            next: (bancos: any[]) => {
                let todosClientes: any[] = [];
                let completadas = 0;
                if (!bancos || bancos.length === 0) return;
                bancos.forEach(banco => {
                    this.clienteService.getClientes(banco.id_banco, { page: 1, limit: 100 }).subscribe({
                        next: (clientes: any[]) => {
                            todosClientes = [...todosClientes, ...(clientes || [])];
                            completadas++;
                            if (completadas === bancos.length) this.clientes = todosClientes;
                        },
                        error: () => { completadas++; }
                    });
                });
            }
        });
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.cuenta = {
            id_cuenta: '', numero_cuenta: '', tipo_cuenta: 'ahorros',
            saldo: 0, fecha_apertura: new Date().toISOString().split('T')[0],
            estado: true, id_cliente: '', fecha_creacion: new Date().toISOString()
        };
        this.submitted = false;
        this.cuentaDialog = true;
    }

    editCuenta(cuenta: Cuenta) {
        this.cuenta = { ...cuenta };
        this.cuentaDialog = true;
    }

    deleteCuenta(cuenta: Cuenta) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar la cuenta "${cuenta.numero_cuenta}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.cuentaService.deleteCuenta(cuenta.id_cliente, cuenta.id_cuenta).subscribe({
                    next: () => {
                        this.cuentas.set(this.cuentas().filter(c => c.id_cuenta !== cuenta.id_cuenta));
                        this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Cuenta eliminada correctamente' });
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la cuenta' });
                    }
                });
            }
        });
    }

    deleteSelectedCuentas() {
        this.confirmationService.confirm({
            message: '¿Eliminar las cuentas seleccionadas?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedCuentas.map(c => c.id_cuenta);
                this.cuentas.set(this.cuentas().filter(c => !ids.includes(c.id_cuenta)));
                this.selectedCuentas = [];
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cuentas eliminadas' });
            }
        });
    }

    hideDialog() {
        this.cuentaDialog = false;
        this.submitted = false;
    }

    saveCuenta() {
        this.submitted = true;
        if (!this.cuenta.numero_cuenta?.trim() || !this.cuenta.id_cliente) return;

        if (this.cuenta.id_cuenta) {
            const updateReq: UpdateCuentaRequest = {
                numero_cuenta: this.cuenta.numero_cuenta,
                tipo_cuenta: this.cuenta.tipo_cuenta,
                saldo: this.cuenta.saldo,
                estado: this.cuenta.estado
            };
            this.cuentaService.updateCuenta(this.cuenta.id_cliente, this.cuenta.id_cuenta, updateReq).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Cuenta actualizada correctamente' });
                    this.loadCuentas();
                    this.cuentaDialog = false;
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la cuenta' });
                }
            });
        } else {
            const createReq: CreateCuentaRequest = {
                numero_cuenta: this.cuenta.numero_cuenta,
                tipo_cuenta: this.cuenta.tipo_cuenta,
                saldo: this.cuenta.saldo,
                fecha_apertura: this.cuenta.fecha_apertura,
                estado: this.cuenta.estado,
                id_cliente: this.cuenta.id_cliente
            };
            this.cuentaService.createCuenta(createReq).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Cuenta creada exitosamente' });
                    this.loadCuentas();
                    this.cuentaDialog = false;
                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la cuenta' });
                }
            });
        }
    }
}