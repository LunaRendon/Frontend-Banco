import { Routes } from '@angular/router';
import { AppLayout } from 'src/app/shared/components/layout/layout.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { authRoutes } from 'src/app/features/auth/auth.routes';
import { BancoListComponent } from 'src/app/features/Banco/Banco-list.component';
import { LoginGuard } from 'src/app/core/guards/login.guard';
import { ClienteListComponent } from 'src/app/features/Cliente/Cliente-list.component';
import { Dashboard } from 'src/app/features/dashboard/dashboard';

export const appRoutes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
    // canActivate: [LoginGuard]
  },
  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'bancos', component: BancoListComponent },
      { path: 'clientes', component: ClienteListComponent },
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];