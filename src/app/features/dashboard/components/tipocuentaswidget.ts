import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CuentaService } from 'src/app/core/services/Cuenta.service';
import { BancoService } from 'src/app/core/services/Banco.service';
import { ClienteService } from 'src/app/core/services/Cliente.service';

/**
 * TipoCuentasWidget CORREGIDO:
 * - Carga cuentas reales del backend y agrupa por tipo
 * - La barra de progreso refleja porcentajes reales
 */
@Component({
    selector: 'app-tipo-cuentas-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="widget-card">
            <div class="widget-header">
                <h4 class="widget-title">🏦 Tipos de Cuenta</h4>
                <span class="badge">{{ totalCuentas }} total</span>
            </div>

            <div *ngIf="loading" class="loading-list">
                <div *ngFor="let _ of [1, 2]" class="skeleton-item" style="height:52px"></div>
            </div>

            <div *ngFor="let t of tipos; let i = index" class="tipo-row">
                <div class="tipo-header">
                    <span class="tipo-nombre">{{ t.nombre }}</span>
                    <span class="tipo-count">{{ t.cantidad }}</span>
                </div>
                <div class="barra-fondo">
                    <div class="barra-fill" [class]="'barra-' + (i % 2 === 0 ? 'blue' : 'purple')" [style.width.%]="totalCuentas ? (t.cantidad / totalCuentas) * 100 : 0"></div>
                </div>
                <span class="tipo-pct">{{ totalCuentas ? ((t.cantidad / totalCuentas) * 100 | number: '1.0-0') : 0 }}%</span>
            </div>

            <div *ngIf="!loading && tipos.length === 0" class="empty-state">Sin cuentas registradas</div>
        </div>

        <style>
            .widget-card {
                background: white;
                border-radius: 16px;
                padding: 1.25rem;
                box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
            }
            .widget-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            .widget-title {
                font-size: 1rem;
                font-weight: 700;
                color: #1e293b;
                margin: 0;
            }
            .badge {
                font-size: 0.7rem;
                background: #fef3c7;
                color: #d97706;
                padding: 2px 8px;
                border-radius: 999px;
                font-weight: 600;
            }
            .tipo-row {
                margin-bottom: 1rem;
            }
            .tipo-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 4px;
            }
            .tipo-nombre {
                font-size: 0.875rem;
                font-weight: 600;
                color: #334155;
            }
            .tipo-count {
                font-size: 0.875rem;
                font-weight: 700;
                color: #1e293b;
            }
            .barra-fondo {
                width: 100%;
                height: 8px;
                background: #f1f5f9;
                border-radius: 999px;
                overflow: hidden;
            }
            .barra-fill {
                height: 100%;
                border-radius: 999px;
                transition: width 0.8s ease;
            }
            .barra-blue {
                background: linear-gradient(90deg, #3b82f6, #6366f1);
            }
            .barra-purple {
                background: linear-gradient(90deg, #8b5cf6, #ec4899);
            }
            .tipo-pct {
                font-size: 0.7rem;
                color: #94a3b8;
            }
            .loading-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            .skeleton-item {
                border-radius: 10px;
                background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            }
            @keyframes shimmer {
                0% {
                    background-position: 200% 0;
                }
                100% {
                    background-position: -200% 0;
                }
            }
            .empty-state {
                text-align: center;
                color: #94a3b8;
                padding: 2rem;
                font-size: 0.875rem;
            }
        </style>
    `
})
export class TipoCuentasWidget implements OnInit {
    tipos: { nombre: string; cantidad: number }[] = [];
    totalCuentas = 0;
    loading = true;

    constructor(
    private cuentaService: CuentaService,
    private bancoService: BancoService,
    private clienteService: ClienteService
) {}

    ngOnInit() {
        this.cargarCuentas();
    }

    cargarCuentas() {
    this.bancoService.getBancos({ page: 1, limit: 100 }).subscribe({
        next: (bancos: any[]) => {
            let todasCuentas: any[] = [];
            let completadas = 0;
            if (!bancos || bancos.length === 0) { this.loading = false; return; }

            bancos.forEach(banco => {
                this.clienteService.getClientes(banco.id_banco, { page: 1, limit: 100 }).subscribe({
                    next: (clientes: any[]) => {
                        let subCompletadas = 0;
                        if (!clientes || clientes.length === 0) {
                            completadas++;
                            if (completadas === bancos.length) this.procesarCuentas(todasCuentas);
                            return;
                        }
                        clientes.forEach((c: any) => {
                            this.cuentaService.getCuentasByCliente(c.id_cliente).subscribe({
                                next: (cuentas: any[]) => {
                                    todasCuentas = [...todasCuentas, ...(cuentas || [])];
                                    subCompletadas++;
                                    if (subCompletadas === clientes.length) {
                                        completadas++;
                                        if (completadas === bancos.length) this.procesarCuentas(todasCuentas);
                                    }
                                },
                                error: () => {
                                    subCompletadas++;
                                    if (subCompletadas === clientes.length) {
                                        completadas++;
                                        if (completadas === bancos.length) this.procesarCuentas(todasCuentas);
                                    }
                                }
                            });
                        });
                    },
                    error: () => {
                        completadas++;
                        if (completadas === bancos.length) this.procesarCuentas(todasCuentas);
                    }
                });
            });
        },
        error: () => { this.loading = false; }
    });
}

procesarCuentas(cuentas: any[]) {
    const unique = Array.from(
        new Map(cuentas.map(c => [c.id_cuenta, c])).values()
    );
    const conteo: Record<string, number> = {};
    unique.forEach(c => {
        const tipo = c.tipo_cuenta || 'Sin tipo';
        conteo[tipo] = (conteo[tipo] || 0) + 1;
    });
    this.tipos = Object.entries(conteo).map(([nombre, cantidad]) => ({ nombre, cantidad }));
    this.totalCuentas = unique.length;
    this.loading = false;
}
}
