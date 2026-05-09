import { Component, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StatsWidget } from './components/statswidget';
import { RecentClientesWidget } from './components/recentclienteswidget';
import { TipoCuentasWidget } from './components/tipocuentaswidget';
import { NotificationsWidget } from './components/notificationswidget';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/enviroment';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, DatePipe, FormsModule, StatsWidget, RecentClientesWidget, TipoCuentasWidget, NotificationsWidget],
    templateUrl: './dashboard.html',
    styles: [`
        .dashboard-wrapper { padding: 1.5rem; max-width: 1280px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.75rem; }
        .dashboard-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.02em; }
        .dashboard-subtitle { font-size: 0.875rem; color: #64748b; margin: 4px 0 0; }
        .dashboard-date { font-size: 0.8rem; color: #64748b; background: white; padding: 0.5rem 1rem; border-radius: 10px; box-shadow: 0 1px 6px rgba(0,0,0,0.06); white-space: nowrap; }
        .section { margin-bottom: 1.5rem; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 16px rgba(0,0,0,0.08); margin-bottom: 1.25rem; }
        .saldo-amount { font-size: 2.5rem; font-weight: 800; color: #0f172a; }
        .saldo-label { font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem; }
        .badge-tipo { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .badge-ahorros { background: #dcfce7; color: #16a34a; }
        .badge-corriente { background: #dbeafe; color: #2563eb; }
        .op-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
        .op-tipo { font-size: 0.875rem; font-weight: 600; }
        .op-fecha { font-size: 0.75rem; color: #94a3b8; }
        .op-monto-dep { color: #16a34a; font-weight: 700; }
        .op-monto-ret { color: #dc2626; font-weight: 700; }
        .op-monto-tra { color: #2563eb; font-weight: 700; }
        .btn-accion { border: none; border-radius: 10px; padding: 0.6rem 1.2rem; font-weight: 600; font-size: 0.875rem; cursor: pointer; transition: opacity 0.2s; }
        .btn-deposito { background: #dcfce7; color: #16a34a; }
        .btn-retiro { background: #fee2e2; color: #dc2626; }
        .btn-transferencia { background: #dbeafe; color: #2563eb; }
        .btn-accion:hover { opacity: 0.8; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; padding: 2rem; width: 100%; max-width: 420px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
        .modal-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; }
        .form-label { display: block; font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; color: #374151; }
        .form-input { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; box-sizing: border-box; margin-bottom: 1rem; }
        .form-select { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.875rem; box-sizing: border-box; margin-bottom: 1rem; }
        .btn-primary { width: 100%; padding: 0.75rem; background: #16a34a; color: white; border: none; border-radius: 10px; font-weight: 700; font-size: 0.875rem; cursor: pointer; }
        .btn-cancel { width: 100%; padding: 0.75rem; background: #f1f5f9; color: #374151; border: none; border-radius: 10px; font-weight: 600; font-size: 0.875rem; cursor: pointer; margin-top: 0.5rem; }
        .msg-error { color: #dc2626; font-size: 0.8rem; margin-bottom: 0.75rem; }
        .msg-success { color: #16a34a; font-size: 0.8rem; margin-bottom: 0.75rem; }
        @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } .dashboard-header { flex-direction: column; gap: 0.75rem; } }
    `]
})
export class Dashboard {
    hoy = new Date();
    cuenta: any = null;
    operaciones: any[] = [];
    todasCuentas: any[] = [];
    loadingCuenta = false;
    procesando = false;

    modalVisible = false;
    tipoOperacion: 'deposito' | 'retiro' | 'transferencia' = 'deposito';
    monto = 0;
    cuentaDestino = '';
    msgError = '';
    msgExito = '';

    constructor(public authService: AuthService, private http: HttpClient) {
        if (this.authService.isConsumidor()) {
            this.cargarDatosCliente();
            this.cargarTodasCuentas();
        }
    }

    cargarDatosCliente() {
        const idCuenta = localStorage.getItem('id_cuenta');
        if (!idCuenta) return;
        this.loadingCuenta = true;

        this.http.get<any[]>(`${environment.apiUrl}cuentas/`).subscribe({
            next: (cuentas) => {
                this.cuenta = (cuentas || []).find(c => c.id_cuenta === idCuenta) || null;
                this.loadingCuenta = false;
            },
            error: () => { this.loadingCuenta = false; }
        });

        this.http.get<any[]>(`${environment.apiUrl}operaciones`).subscribe({
            next: (ops) => {
                this.operaciones = (ops || [])
                    .filter(o => o.id_cuenta_origen === idCuenta || o.id_cuenta_destino === idCuenta)
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .slice(0, 5);
            }
        });
    }

    cargarTodasCuentas() {
        this.http.get<any[]>(`${environment.apiUrl}cuentas/`).subscribe({
            next: (cuentas) => {
                const idCuenta = localStorage.getItem('id_cuenta');
                this.todasCuentas = (cuentas || []).filter(c => c.id_cuenta !== idCuenta);
            }
        });
    }

    abrirModal(tipo: 'deposito' | 'retiro' | 'transferencia') {
        this.tipoOperacion = tipo;
        this.monto = 0;
        this.cuentaDestino = '';
        this.msgError = '';
        this.msgExito = '';
        this.modalVisible = true;
    }

    cerrarModal() {
        this.modalVisible = false;
    }

    ejecutarOperacion() {
        this.msgError = '';
        this.msgExito = '';
        const idCuenta = localStorage.getItem('id_cuenta');

        if (!this.monto || this.monto <= 0) {
            this.msgError = 'El monto debe ser mayor a 0.';
            return;
        }

        if (this.tipoOperacion === 'retiro' && this.cuenta && this.monto > this.cuenta.saldo) {
            this.msgError = 'Saldo insuficiente.';
            return;
        }

        if (this.tipoOperacion === 'transferencia' && !this.cuentaDestino) {
            this.msgError = 'Selecciona una cuenta destino.';
            return;
        }

        this.procesando = true;

        const body: any = {
            tipo_operacion: this.tipoOperacion,
            monto: this.monto,
            id_cuenta_origen: this.tipoOperacion === 'deposito' ? null : idCuenta,
            id_cuenta_destino: this.tipoOperacion === 'retiro' ? null :
                this.tipoOperacion === 'deposito' ? idCuenta : this.cuentaDestino
        };

        this.http.post(`${environment.apiUrl}operaciones`, body).subscribe({
            next: () => {
                this.msgExito = 'Operación realizada exitosamente.';
                this.procesando = false;
                setTimeout(() => {
                    this.modalVisible = false;
                    this.cargarDatosCliente();
                }, 1500);
            },
            error: (err) => {
                this.msgError = err.error?.detail || 'Error al procesar la operación.';
                this.procesando = false;
            }
        });
    }

    getMontoCss(op: any): string {
        const idCuenta = localStorage.getItem('id_cuenta');
        if (op.tipo_operacion === 'deposito') return 'op-monto-dep';
        if (op.tipo_operacion === 'retiro') return 'op-monto-ret';
        return op.id_cuenta_destino === idCuenta ? 'op-monto-dep' : 'op-monto-ret';
    }

    getMontoPrefix(op: any): string {
        const idCuenta = localStorage.getItem('id_cuenta');
        if (op.tipo_operacion === 'deposito') return '+';
        if (op.tipo_operacion === 'retiro') return '-';
        return op.id_cuenta_destino === idCuenta ? '+' : '-';
    }
}