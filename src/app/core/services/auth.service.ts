import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/enviroment';

export type UserRole = 'admin' | 'consumidor';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly TOKEN_KEY = 'jwt_token';
    private readonly USER_KEY = 'user_data';
    private currentUserSubject = new BehaviorSubject<any | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    login(username: string, contrasena: string): Observable<any> {
        return this.http
            .post(`${environment.apiUrl}usuarios_app/login`, {
                username,
                contraseña: contrasena
            })
            .pipe(
                tap((response: any) => {
                    localStorage.setItem(this.TOKEN_KEY, response.access_token);
                    localStorage.setItem(
                        this.USER_KEY,
                        JSON.stringify({
                            nombre_usuario: username,
                            es_admin: response.rol === 'admin_app',
                            rol: response.rol
                        })
                    );
                    this.currentUserSubject.next({ nombre_usuario: username, rol: response.rol });

                    if (response.rol === 'cliente' && response.id_cuenta) {
                        localStorage.setItem('id_cuenta', response.id_cuenta);
                    }
                })
            );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    getCurrentUser(): any {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getUserRole(): UserRole | null {
        const user = this.getCurrentUser();
        if (!user) return null;
        return user.rol === 'admin_app' ? 'admin' : 'consumidor';
    }

    isAdmin(): boolean {
        return this.getUserRole() === 'admin';
    }

    isConsumidor(): boolean {
        return this.getUserRole() === 'consumidor';
    }

    canAccess(route: string): boolean {
        const role = this.getUserRole();
        if (!role) return false;
        if (role === 'admin') return true;
        const cleanRoute = route.toLowerCase().split('?')[0].replace(/^\//, '');
        return ['dashboard', 'bancos'].some((r) => cleanRoute.startsWith(r));
    }

    private loadUserFromStorage(): void {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const data = localStorage.getItem(this.USER_KEY);
        if (token && data) {
            try {
                this.currentUserSubject.next(JSON.parse(data));
            } catch {
                this.logout();
            }
        }
    }
}
