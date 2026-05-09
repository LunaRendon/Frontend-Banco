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
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/enviroment';

interface Operacion {
    id_operacion: string;
    tipo_operacion: string;
    monto: number;
    fecha: string;
    id_cuenta_origen?: string;
    id_cuenta_destino?: string;
    fecha_creacion: string;
    fecha_edicion?: string;
}

@Component({
    selector: 'app-operacion-list',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, RippleModule,
        DialogModule, InputTextModule, ConfirmDialogModule, ToastModule, IconFieldModule, InputIconModule],
    templateUrl: './Operacion-list.component.html',
    providers: [MessageService, ConfirmationService]
})
export class OperacionListComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    operaciones = signal<Operacion[]>([]);
    selectedOperaciones: Operacion[] = [];
    operacion: Operacion = this.emptyOperacion();
    cuentas: any[] = [];
    operacionDialog = false;
    submitted = false;
    loading = false;

    tiposOperacion = [
        { label: 'Depósito', value: 'deposito' },
        { label: 'Retiro', value: 'retiro' },
        { label: 'Transferencia', value: 'transferencia' }
    ];

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        public authService: AuthService
    ) {}

    ngOnInit() {
        this.loadOperaciones();
        this.loadCuentas();
    }

    emptyOperacion(): Operacion {
        return {
            id_operacion: '',
            tipo_operacion: 'deposito',
            monto: 0,
            fecha: new Date().toISOString(),
            id_cuenta_origen: '',
            id_cuenta_destino: '',
            fecha_creacion: new Date().toISOString()
        };
    }

    loadOperaciones() {
        this.loading = true;
        this.http.get<Operacion[]>(`${environment.apiUrl}operaciones`).subscribe({
            next: (data) => {
                this.operaciones.set(data || []);
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    loadCuentas() {
        this.http.get<any[]>(`${environment.apiUrl}cuentas/`).subscribe({
            next: (data) => { this.cuentas = data || []; },
            error: () => {}
        });
    }

    onGlobalFilter(event: Event) {
        this.dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.operacion = this.emptyOperacion();
        this.submitted = false;
        this.operacionDialog = true;
    }

    editOperacion(op: Operacion) {
        this.operacion = { ...op };
        this.operacionDialog = true;
    }

    deleteOperacion(op: Operacion) {
        this.confirmationService.confirm({
            message: `¿Seguro que deseas eliminar esta operación?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.http.delete(`${environment.apiUrl}operaciones/${op.id_operacion}`).subscribe({
                    next: () => {
                        this.operaciones.set(this.operaciones().filter(o => o.id_operacion !== op.id_operacion));
                        this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: 'Operación eliminada' });
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
                    }
                });
            }
        });
    }

    deleteSelectedOperaciones() {
        this.confirmationService.confirm({
            message: '¿Eliminar las operaciones seleccionadas?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const ids = this.selectedOperaciones.map(o => o.id_operacion);
                this.operaciones.set(this.operaciones().filter(o => !ids.includes(o.id_operacion)));
                this.selectedOperaciones = [];
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Operaciones eliminadas' });
            }
        });
    }

    hideDialog() {
        this.operacionDialog = false;
        this.submitted = false;
    }

    saveOperacion() {
        this.submitted = true;
        if (!this.operacion.tipo_operacion || !this.operacion.monto) return;

        const body: any = {
            tipo_operacion: this.operacion.tipo_operacion,
            monto: this.operacion.monto,
            id_cuenta_origen: this.operacion.id_cuenta_origen || null,
            id_cuenta_destino: this.operacion.id_cuenta_destino || null
        };

        if (this.operacion.id_operacion) {
            this.http.put(`${environment.apiUrl}operaciones/${this.operacion.id_operacion}`, body).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Actualizada', detail: 'Operación actualizada' });
                    this.loadOperaciones();
                    this.operacionDialog = false;
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.detail || 'No se pudo actualizar' });
                }
            });
        } else {
            this.http.post(`${environment.apiUrl}operaciones`, body).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Creada', detail: 'Operación creada exitosamente' });
                    this.loadOperaciones();
                    this.operacionDialog = false;
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.detail || 'No se pudo crear' });
                }
            });
        }
    }

    getNombreCuenta(id: string): string {
        const cuenta = this.cuentas.find(c => c.id_cuenta === id);
        return cuenta ? cuenta.numero_cuenta : id?.substring(0, 8) + '...' || '-';
    }

    getTipoLabel(tipo: string): string {
        const labels: Record<string, string> = {
            'deposito': 'Depósito',
            'retiro': 'Retiro',
            'transferencia': 'Transferencia'
        };
        return labels[tipo] || tipo;
    }

    getTipoSeverity(tipo: string): string {
        const severities: Record<string, string> = {
            'deposito': 'text-green-500',
            'retiro': 'text-red-500',
            'transferencia': 'text-blue-500'
        };
        return severities[tipo] || '';
    }
}