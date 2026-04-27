import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from 'src/app/core/services/Cliente.service';
import { BancoService } from 'src/app/core/services/Banco.service';
import { CuentaService } from 'src/app/core/services/Cuenta.service';

/**
 * StatsWidget CORREGIDO:
 * - Carga bancos dinámicamente desde el backend en lugar de tener id_banco hardcodeado
 * - Usa el primer banco disponible para cargar clientes reales
 * - Manejo correcto de errores con mensajes útiles
 */
@Component({
    selector: 'app-stats-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- TOTAL CLIENTES -->
            <div class="stat-card stat-blue">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                    <span class="stat-label">Total Clientes</span>
                    <span class="stat-value" [class.loading]="loadingClientes">
                        {{ loadingClientes ? '...' : totalClientes }}
                    </span>
                    <span class="stat-sub">registrados en el banco</span>
                </div>
            </div>

            <!-- CLIENTES CON CORREO -->
            <div class="stat-card stat-green">
                <div class="stat-icon">✅</div>
                <div class="stat-info">
                    <span class="stat-label">Con correo</span>
                    <span class="stat-value" [class.loading]="loadingClientes">
                        {{ loadingClientes ? '...' : clientesActivos }}
                    </span>
                    <span class="stat-sub">clientes verificados</span>
                </div>
            </div>

            <!-- CUENTAS TOTALES -->
            <div class="stat-card stat-purple">
                <div class="stat-icon">🏦</div>
                <div class="stat-info">
                    <span class="stat-label">Cuentas Totales</span>
                    <span class="stat-value" [class.loading]="loadingCuentas">
                        {{ loadingCuentas ? '...' : cuentasTotales }}
                    </span>
                    <span class="stat-sub">en el sistema</span>
                </div>
            </div>
        </div>

        <!-- Error message -->
        <div *ngIf="errorMsg" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">⚠️ {{ errorMsg }}</div>

        <style>
            .stat-card {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.25rem 1.5rem;
                border-radius: 16px;
                color: white;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
                transition:
                    transform 0.2s ease,
                    box-shadow 0.2s ease;
            }
            .stat-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
            }
            .stat-blue {
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            }
            .stat-green {
                background: linear-gradient(135deg, #10b981, #047857);
            }
            .stat-purple {
                background: linear-gradient(135deg, #8b5cf6, #6d28d9);
            }
            .stat-icon {
                font-size: 2rem;
                opacity: 0.85;
            }
            .stat-info {
                display: flex;
                flex-direction: column;
            }
            .stat-label {
                font-size: 0.78rem;
                opacity: 0.85;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }
            .stat-value {
                font-size: 2.2rem;
                font-weight: 800;
                line-height: 1.1;
            }
            .stat-value.loading {
                opacity: 0.5;
            }
            .stat-sub {
                font-size: 0.75rem;
                opacity: 0.75;
                margin-top: 2px;
            }
        </style>
    `
})
export class StatsWidget implements OnInit {
    totalClientes = 0;
    clientesActivos = 0;
    cuentasTotales = 0;
    loadingClientes = true;
    loadingCuentas = true;
    errorMsg = '';

    private id_banco = '';

    constructor(
        private clienteService: ClienteService,
        private bancoService: BancoService,
        private cuentaService: CuentaService
    ) {}

    ngOnInit() {
        this.cargarBancosYDatos();
    }

    cargarBancosYDatos() {
        this.bancoService.getBancos({ page: 1, limit: 100 }).subscribe({
            next: (bancos: any[]) => {
                if (!bancos || bancos.length === 0) {
                    this.loadingClientes = false;
                    this.errorMsg = 'No hay bancos registrados en el sistema';
                    return;
                }

                let todosClientes: any[] = [];
                let completadas = 0;

                bancos.forEach((banco) => {
                    this.clienteService.getClientes(banco.id_banco, { page: 1, limit: 100 }).subscribe({
                        next: (clientes: any[]) => {
                            todosClientes = [...todosClientes, ...(clientes || [])];
                            completadas++;
                            if (completadas === bancos.length) {
                                this.totalClientes = todosClientes.length;
                                this.clientesActivos = todosClientes.filter((c) => c.correo && c.correo !== '').length;
                                this.loadingClientes = false;
                            }
                        },
                        error: () => {
                            completadas++;
                            if (completadas === bancos.length) {
                                this.totalClientes = todosClientes.length;
                                this.clientesActivos = todosClientes.filter((c) => c.correo && c.correo !== '').length;
                                this.loadingClientes = false;
                            }
                        }
                    });
                });
            },
            error: (err) => {
                this.loadingClientes = false;
                if (err.status === 0) {
                    this.errorMsg = 'Backend no disponible en http://127.0.0.1:8000';
                } else {
                    this.errorMsg = 'Error al conectar con el backend';
                }
            }
        });

        this.cargarCuentas();
    }

    cargarCuentas() {
        this.loadingCuentas = true;
        this.cuentaService.getCuentas({ page: 1, limit: 1000 }, {}).subscribe({
            next: (cuentas: any[]) => {
                this.cuentasTotales = cuentas?.length || 0;
                this.loadingCuentas = false;
            },
            error: () => {
                this.loadingCuentas = false;
            }
        });
    }
}
