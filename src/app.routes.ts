import { Routes } from '@angular/router';
import { Dashboard } from 'src/app/features/dashboard/dashboard';
import { AppLayout } from 'src/app/shared/components/layout/layout.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { authRoutes } from 'src/app/features/auth/auth.routes';
import { BancoListComponent } from 'src/app/features/Banco/Banco-list.component';
export const appRoutes: Routes = [
  {
    path: 'auth',
    children: authRoutes,
    //canActivate: [LoginGuard] 
  },

  {
    path: '',
    component: AppLayout,
    canActivate: [AuthGuard], 
    children: [
      { path: '', component: Dashboard },
      { path: 'dashboard', component: Dashboard },
      { path: 'bancos', component: BancoListComponent },
  
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];
