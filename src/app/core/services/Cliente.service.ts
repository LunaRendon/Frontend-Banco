import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, ClienteFilters, CreateClienteRequest, UpdateClienteRequest } from '../../shared/models/Cliente.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly endpoint = 'clientes';

  constructor(private apiService: ApiService) {}

  getClientes( pagination: PaginationParams, filters?: ClienteFilters): Observable<Cliente[]> {
    return this.apiService.getPaginated<Cliente>(`${this.endpoint}/$`,pagination,filters);
  }

 
  getClienteById(id_banco: string, codigo: string): Observable<Cliente> {
    return this.apiService.get<Cliente>(`${this.endpoint}/${id_banco}/cliente/${codigo}`);
  }

 
  createCliente(cliente: CreateClienteRequest): Observable<Cliente> {
    return this.apiService.post<Cliente>(this.endpoint, cliente);
  }

 
  updateCliente(id_banco: string, codigo: string, cliente: UpdateClienteRequest): Observable<Cliente> {
    return this.apiService.put<Cliente>(`${this.endpoint}/${id_banco}/cliente/${codigo}`, cliente);
  }

 
  deleteCliente(id_banco: string, codigo: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id_banco}/cliente/${codigo}`);
  }

 
  getClientesByNombre(id_banco: string, nombre: string): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.endpoint}/${id_banco}/nombre/${nombre}`);
  }

 
  getClientesByNumDocumento(id_banco: string, num_documento: string): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.endpoint}/${id_banco}/tipo/${num_documento}`);
  }

 
  getClientesByDTipoDocumento(id_banco: string, tipo_documento: string): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>(`${this.endpoint}/${id_banco}/detalle/${tipo_documento}`);
  }

}
