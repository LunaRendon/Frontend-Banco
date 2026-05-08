import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppMenuitem } from 'src/app/shared/components/menuitem/menuitem.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl: './menu.component.html'
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        const user = this.authService.getCurrentUser();
        const isAdmin = this.authService.isAdmin();

        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Gestión',
                items: [
                    { label: 'Bancos', icon: 'pi pi-fw pi-building-columns', routerLink: ['/bancos'] },
                    ...(isAdmin ? [{ label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/clientes'] }] : []),
                    ...(isAdmin ? [{ label: 'Cuentas', icon: 'pi pi-fw pi-address-book', routerLink: ['/cuentas'] }] : []),
                    { label: 'Tarjetas ', icon: 'pi pi-fw pi-credit-card', routerLink: ['/tarjetas'] },
                    ...(isAdmin ? [{ label: 'Operaciones', icon: 'pi pi-fw pi-calculator', routerLink: ['/operaciones'] }] : []),
                    { label: 'Préstamos', icon: 'pi pi-fw pi pi-fw pi-money-bill', routerLink: ['/prestamos'] },
                    ...(isAdmin ? [{ label: 'Usuarios de la aplicación', icon: 'pi pi-fw pi-mobile', routerLink: ['/usuarios-aplicacion'] }] : []),
                    ...(isAdmin ? [{ label: 'Usuarios', icon: 'pi pi-fw pi-user', routerLink: ['/usuarios'] }] : [])
                ]
            },


            {
                label: 'Cuenta',
                icon: 'ppi pi-fw pi-user',
                items: [
                    { label: 'Mi Perfil', icon: 'pi pi-fw pi-id-card', routerLink: ['/perfil'] },
                    { label: 'Cerrar Sesión', icon: 'pi pi-fw pi-sign-out', command: () => this.logout() }
                ]
            }
        ];
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}
