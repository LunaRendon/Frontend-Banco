import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/enviroment';

export type UserRole = 'admin' | 'consumidor';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  rol: string;
}

export interface CurrentUser {
  username: string;
  rol: string;
  id_banco?: string;
}

/**
 * AuthService CORREGIDO:
 * - login() ahora llama al endpoint real del backend POST /usuarios_app/login
 * - Guarda el JWT en localStorage y lo expone via getToken()
 * - El interceptor (auth.interceptor.ts) usa getToken() en cada request
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user';
  private readonly API_URL = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        this.currentUserSubject.next(JSON.parse(userData));
      } catch {
        this.logout();
      }
    }
  }

  /**
   * Llama al backend real: POST /usuarios_app/login
   * Retorna Observable<LoginResponse>
   */
  loginWithBackend(username: string, contraseña: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}usuarios_app/login`, {
      username,
      contraseña
    }).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        const user: CurrentUser = {
          username,
          rol: response.rol
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Mantiene compatibilidad con el login local (para usuarios hardcodeados admin/usuario)
   * pero ahora también intenta el backend primero.
   */
  login(nombre_usuario: string, contrasena: string): boolean {
    // Login local de respaldo (admin local para desarrollo)
    const localUsers: Record<string, { pass: string; rol: string }> = {
      'admin': { pass: 'admin123', rol: 'admin' },
      'usuario': { pass: 'abc123', rol: 'consumidor' }
    };

    const localUser = localUsers[nombre_usuario];
    if (localUser && localUser.pass === contrasena) {
      const user: CurrentUser = { username: nombre_usuario, rol: localUser.rol };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    return false;
  }
  getAllUsers(): any[] {
  return [
    { nombre_usuario: 'admin', email: 'admin@gmail.com' },
    { nombre_usuario: 'usuario', email: 'usuario@gmail.com' }
  ];
}

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * NUEVO: devuelve el JWT para que el interceptor lo use en el header Authorization.
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    if (!user) return null;
    return user.rol === 'admin' ? 'admin' : 'consumidor';
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

    const consumerRoutes = ['dashboard', 'bancos', 'perfil'];
    const cleanRoute = route.toLowerCase().split('?')[0].replace(/^\//, '');
    return consumerRoutes.some(r => cleanRoute.startsWith(r));
  }
  registerUser(usuario: any, password: string): boolean {
  localStorage.setItem(`user_${usuario}`, usuario);
  localStorage.setItem(`pwd_${usuario}`, btoa(password));

  return true;
}
}
