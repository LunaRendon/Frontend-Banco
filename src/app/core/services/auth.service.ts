import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../../shared/models/Usuario.model';

export type UserRole = 'admin' | 'consumidor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'user_data';
  private readonly USERS_KEY = 'all_users';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
    const users = this.getAllUsers();
    if (users.length === 0) {
      this.createDefaultAdmin();
      this.createDefaultConsumidor();
    }
  }

  private createDefaultAdmin(): void {
    const admin: Usuario = {
      id_usuario: crypto.randomUUID(),
      id: crypto.randomUUID(),
      nombre: 'Administrador',
      nombre_usuario: 'admin',
      email: 'admin@banco.local',
      telefono: '0000000000',
      activo: true,
      es_admin: true,
      fecha_creacion: new Date().toISOString(),
      fecha_edicion: new Date().toISOString(),
      contraseña: 'admin123'
    };
    const users = this.getAllUsers();
    users.push(admin);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(`pwd_${admin.nombre_usuario}`, btoa(admin.contraseña));
    console.log('✅ Usuario administrador por defecto creado.');
  }

  private createDefaultConsumidor(): void {
    const consumidor: Usuario = {
      id_usuario: crypto.randomUUID(),
      id: crypto.randomUUID(),
      nombre: 'Consumidor',
      nombre_usuario: 'usuario',
      email: 'usuario@banco.local',
      telefono: '0000000000',
      activo: true,
      es_admin: false,
      fecha_creacion: new Date().toISOString(),
      fecha_edicion: new Date().toISOString(),
      contraseña: 'abc123'
    };

    const users = this.getAllUsers();
    users.push(consumidor);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(`pwd_${consumidor.nombre_usuario}`, btoa(consumidor.contraseña));
    console.log('✅ Usuario consumidor por defecto creado.');
  }


  getAllUsers(): Usuario[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      localStorage.removeItem(this.USERS_KEY);
      return [];
    }
  }

  registerUser(usuario: Usuario, contrasena: string): boolean {
    const users = this.getAllUsers();
    const exists = users.some(u => u.nombre_usuario === usuario.nombre_usuario || u.email === usuario.email);
    if (exists) return false;

    const newUser = {
      ...usuario,
      id_usuario: crypto.randomUUID(),
      id: crypto.randomUUID(),
      fecha_creacion: new Date().toISOString(),
      activo: true,
      es_admin: false
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(`pwd_${newUser.nombre_usuario}`, btoa(contrasena));

    return true;
  }

  login(nombre_usuario: string, contrasena: string): boolean {
    const users = this.getAllUsers();
    const user = users.find(u => u.nombre_usuario === nombre_usuario);
    if (!user) return false;

    const storedPass = localStorage.getItem(`pwd_${nombre_usuario}`);
    if (storedPass !== btoa(contrasena)) return false;

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const data = localStorage.getItem(this.USER_KEY);
    if (data) {
      try {
        const user = JSON.parse(data);
        this.currentUserSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? (user.es_admin ? 'admin' : 'consumidor') : null;
  }

  canAccess(route: string): boolean {
    const role = this.getUserRole();
    if (!role) return false;

    const cleanRoute = route.toLowerCase().split('?')[0].replace(/^\//, '');

    if (role === 'admin') return true;

    const consumerRoutes = [
      'dashboard',
      'bancos'
    ];

    return consumerRoutes.some(r => cleanRoute.startsWith(r));
  }


  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isConsumidor(): boolean {
    return this.getUserRole() === 'consumidor';
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    // Si tu "token" es simplemente el id_usuario o algo guardado en localStorage,
    // puedes retornarlo aquí. Ejemplo sencillo:
    return user ? user.id_usuario : null;

    // Alternativamente, si quieres usar un valor específico guardado en localStorage:
    // return localStorage.getItem('auth_token');
  }
}