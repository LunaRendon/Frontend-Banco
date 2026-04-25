import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from 'src/app/core/services/Cliente.service';
import { BancoService } from 'src/app/core/services/Banco.service';

/**
 * RecentClientesWidget CORREGIDO:
 * - Carga clientes reales desde el backend en vez de datos hardcodeados
 * - Muestra los últimos 5 clientes registrados
 */
@Component({
  selector: 'app-recent-clientes-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="widget-card">
      <div class="widget-header">
        <h4 class="widget-title">👤 Clientes Recientes</h4>
        <span class="badge">{{ clientes.length }} mostrados</span>
      </div>

      <div *ngIf="loading" class="loading-list">
        <div *ngFor="let _ of [1,2,3]" class="skeleton-item"></div>
      </div>

      <div *ngIf="!loading && clientes.length === 0" class="empty-state">
        Sin clientes registrados
      </div>

      <div *ngFor="let c of clientes" class="cliente-row">
        <div class="cliente-avatar">{{ c.nombre?.charAt(0)?.toUpperCase() }}</div>
        <div class="cliente-info">
          <p class="cliente-nombre">{{ c.nombre }}</p>
          <p class="cliente-doc">{{ c.tipo_documento }} · {{ c.num_documento }}</p>
        </div>
        <span class="estado-badge">Activo</span>
      </div>
    </div>

    <style>
      .widget-card {
        background: white;
        border-radius: 16px;
        padding: 1.25rem;
        box-shadow: 0 2px 16px rgba(0,0,0,0.08);
        margin-bottom: 1.25rem;
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
        background: #e0e7ff;
        color: #4338ca;
        padding: 2px 8px;
        border-radius: 999px;
        font-weight: 600;
      }
      .cliente-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 0.5rem;
        border-radius: 10px;
        transition: background 0.15s;
      }
      .cliente-row:hover { background: #f8fafc; }
      .cliente-avatar {
        width: 36px; height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #6366f1);
        color: white;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 0.9rem;
        flex-shrink: 0;
      }
      .cliente-info { flex: 1; }
      .cliente-nombre { margin: 0; font-size: 0.875rem; font-weight: 600; color: #1e293b; }
      .cliente-doc { margin: 0; font-size: 0.75rem; color: #94a3b8; }
      .estado-badge {
        font-size: 0.7rem;
        background: #dcfce7;
        color: #16a34a;
        padding: 2px 8px;
        border-radius: 999px;
        font-weight: 600;
      }
      .loading-list { display: flex; flex-direction: column; gap: 0.5rem; }
      .skeleton-item {
        height: 44px; border-radius: 10px;
        background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      .empty-state { text-align: center; color: #94a3b8; padding: 2rem; font-size: 0.875rem; }
    </style>
  `
})
export class RecentClientesWidget implements OnInit {
  clientes: any[] = [];
  loading = true;

  constructor(
    private clienteService: ClienteService,
    private bancoService: BancoService
  ) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.bancoService.getBancos({ page: 1, limit: 1 }).subscribe({
      next: (bancos: any[]) => {
        if (bancos && bancos.length > 0) {
          const id_banco = bancos[0].id_banco || bancos[0].id;
          this.clienteService.getClientes(id_banco, { page: 1, limit: 5 }).subscribe({
            next: (clientes: any[]) => {
              // Mostrar solo los últimos 5
              this.clientes = (clientes || []).slice(-5).reverse();
              this.loading = false;
            },
            error: () => { this.loading = false; }
          });
        } else {
          this.loading = false;
        }
      },
      error: () => { this.loading = false; }
    });
  }
}
