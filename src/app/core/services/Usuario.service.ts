import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordRequest, CreateUsuarioRequest, UpdateUsuarioRequest, Usuario, UsuarioFilters } from '../../shared/models/Usuario.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly endpoint = 'usuarios';

  constructor(private apiService: ApiService) { }

  
  getUsuarios(pagination: PaginationParams, filters?: UsuarioFilters): Observable<Usuario[]> {
    return this.apiService.getPaginated<Usuario>(this.endpoint, pagination, filters);
  }

  
  getUsuarioById(id: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/${id}`);
  }

  
  getUsuarioByEmail(email: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/email/${email}`);
  }


  getUsuarioByUsername(username: string): Observable<Usuario> {
    return this.apiService.get<Usuario>(`${this.endpoint}/username/${username}`);
  }

  
  createUsuario(usuario: CreateUsuarioRequest): Observable<Usuario> {
    return this.apiService.post<Usuario>(this.endpoint, usuario);
  }

  
  updateUsuario(id: string, usuario: UpdateUsuarioRequest): Observable<Usuario> {
    return this.apiService.put<Usuario>(`${this.endpoint}/${id}`, usuario);
  }

  
  deleteUsuario(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  
  desactivarUsuario(id: string): Observable<Usuario> {
    return this.apiService.patch<Usuario>(`${this.endpoint}/${id}/desactivar`, {});
  }

  
  changePassword(id: string, passwordData: ChangePasswordRequest): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}/${id}/cambiar-contraseña`, passwordData);
  }

  
  getUsuariosAdmin(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>(`${this.endpoint}/admin/lista`);
  }

  
  verificarEsAdmin(id: string): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/${id}/es-admin`);
  }
}
