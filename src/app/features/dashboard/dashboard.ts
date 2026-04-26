import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { StatsWidget } from './components/statswidget';
import { RecentClientesWidget } from './components/recentclienteswidget';
import { TipoCuentasWidget } from './components/tipocuentaswidget';
import { NotificationsWidget } from './components/notificationswidget';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, DatePipe, StatsWidget, RecentClientesWidget, TipoCuentasWidget, NotificationsWidget],
    templateUrl: './dashboard.html',
    styles: [
        `
            .dashboard-wrapper {
                padding: 1.5rem;
                max-width: 1280px;
                margin: 0 auto;
                background: #f8fafc;
                min-height: 100vh;
            }

            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1.75rem;
            }

            .dashboard-title {
                font-size: 1.75rem;
                font-weight: 800;
                color: #0f172a;
                margin: 0;
                letter-spacing: -0.02em;
            }

            .dashboard-subtitle {
                font-size: 0.875rem;
                color: #64748b;
                margin: 4px 0 0;
            }

            .dashboard-date {
                font-size: 0.8rem;
                color: #64748b;
                background: white;
                padding: 0.5rem 1rem;
                border-radius: 10px;
                box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
                white-space: nowrap;
            }

            .section {
                margin-bottom: 1.5rem;
            }

            .grid-2 {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.25rem;
            }

            @media (max-width: 768px) {
                .grid-2 {
                    grid-template-columns: 1fr;
                }
                .dashboard-header {
                    flex-direction: column;
                    gap: 0.75rem;
                }
            }
        `
    ]
})
export class Dashboard {
    hoy = new Date();
}
