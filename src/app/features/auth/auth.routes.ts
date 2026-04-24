import { Routes } from '@angular/router';
import { Access } from './access/access';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Login } from './login/login';
import { Register } from './register/register';
import { LoginGuard } from 'src/app/core/guards/login.guard';


export const authRoutes: Routes = [
  { path: 'access', component: Access},
  { path: 'login', component: Login, canActivate: [LoginGuard] },
  { path: 'forgot', component: ForgotPassword, canActivate: [LoginGuard] },
  { path: 'register', component: Register, canActivate: [LoginGuard] },

  { path: '**', redirectTo: 'login' }
];
