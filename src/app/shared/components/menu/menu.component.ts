import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';
import { AppMenuitem } from 'src/app/shared/components/menuitem/menuitem.component';


@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, 
        AppMenuitem, 
        RouterModule,
        ],
    templateUrl: './menu.component.html',
})

export class AppMenu {
    model: MenuItem[] = [];

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

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
                    { label: 'Biblioteca', icon: 'pi pi-fw pi-book', routerLink: ['/bibliotecas'] },
                    { label: 'Categorías', icon: 'pi pi-fw pi-tags', routerLink: ['/categorias'] },
                    ...(isAdmin ? [{ label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/clientes'] }] : []),
                    { label: 'Materiales Bibliográficos', icon: 'pi pi-fw pi-file', routerLink: ['/materiales'] },
                    ...(isAdmin ? [{ label: 'Préstamos', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/prestamos'] }] : []),
                    ...(isAdmin ? [{ label: 'Reservas', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/reservas'] }] : []),
                    ...(isAdmin ? [{ label: 'Sanciones', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/sanciones'] }] : []),
                    { label: 'Sedes', icon: 'pi pi-fw pi-map-marker', routerLink: ['/sedes'] },
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
