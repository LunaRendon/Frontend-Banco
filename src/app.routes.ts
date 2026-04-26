import { Routes } from '@angular/router';
import { AppLayout } from 'src/app/shared/components/layout/layout.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { authRoutes } from 'src/app/features/auth/auth.routes';
import { BancoListComponent } from 'src/app/features/Banco/Banco-list.component';
import { LoginGuard } from 'src/app/core/guards/login.guard';
import { ClienteListComponent } from 'src/app/features/Cliente/Cliente-list.component';
import { UsuarioListComponent } from 'src/app/features/Usuario/Usuario-lis.component';
import { Dashboard } from 'src/app/features/dashboard/dashboard';
import { PerfilComponent } from 'src/app/features/perfil/perfil.component';

export const appRoutes: Routes = [
    {
        path: 'auth',
        children: authRoutes
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
            { path: 'perfil', component: PerfilComponent },
            { path: 'clientes', component: ClienteListComponent },
            { path: 'usuarios', component: UsuarioListComponent }
        ]
    },
    { path: '**', redirectTo: 'auth/login' }
];
