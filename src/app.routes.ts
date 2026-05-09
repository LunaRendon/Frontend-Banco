import { Routes } from '@angular/router';
import { AppLayout } from 'src/app/shared/components/layout/layout.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { authRoutes } from 'src/app/features/auth/auth.routes';
import { BancoListComponent } from 'src/app/features/Banco/Banco-list.component';
import { LoginGuard } from 'src/app/core/guards/login.guard';
import { ClienteListComponent } from 'src/app/features/Cliente/Cliente-list.component';
import { CuentaListComponent } from 'src/app/features/Cuenta/Cuenta-list.component';
import { UsuarioAppListComponent } from 'src/app/features/Usuario_App/UsuarioApp-list.component';
import { TarjetaListComponent } from 'src/app/features/Tarjeta/Tarjeta-list.component';
import { UsuarioListComponent } from 'src/app/features/Usuario/Usuario-lis.component';
import { OperacionListComponent } from 'src/app/features/Operacion/Operacion-list.component';
import { PrestamosListComponent } from 'src/app/features/Prestamos/Prestamos-list-components';
import { Dashboard } from 'src/app/features/dashboard/dashboard';
import { PerfilComponent } from 'src/app/features/perfil/perfil.component';
import { TarjetaListComponent } from 'src/app/features/Tarjeta/Tarjeta-list.component';



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
            { path: 'usuarios', component: UsuarioListComponent },
            { path: 'tarjetas', component: TarjetaListComponent }
            { path: 'cuentas', component: CuentaListComponent },
            { path: 'tarjetas', component: TarjetaListComponent },
            { path: 'usuarios', component: UsuarioListComponent },
            { path: 'operaciones', component: OperacionListComponent },
            { path: 'usuarios-aplicacion', component: UsuarioAppListComponent },
            { path: 'prestamos', component: PrestamosListComponent }

        ]
    },
    { path: '**', redirectTo: 'auth/login' }
];
