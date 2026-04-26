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

    getClientes(id_banco: string, pagination: PaginationParams): Observable<Cliente[]> {
        return this.apiService.getPaginated<Cliente>(`${this.endpoint}/${id_banco}`, pagination);
    }

    getClienteById(id_banco: string, id_cliente: string): Observable<Cliente> {
        return this.apiService.get<Cliente>(`${this.endpoint}/${id_banco}/cliente/${id_cliente}`);
    }

    createCliente(cliente: CreateClienteRequest): Observable<Cliente> {
        return this.apiService.post<Cliente>(this.endpoint, cliente);
    }

    updateCliente(id_banco: string, id_cliente: string, cliente: UpdateClienteRequest): Observable<Cliente> {
        return this.apiService.put<Cliente>(`${this.endpoint}/${id_banco}/cliente/${id_cliente}`, cliente);
    }

    deleteCliente(id_banco: string, id_cliente: string): Observable<any> {
        return this.apiService.delete<any>(`${this.endpoint}/${id_banco}/cliente/${id_cliente}`);
    }

    getClientesByNombre(id_banco: string, nombre: string): Observable<Cliente[]> {
        return this.apiService.get<Cliente[]>(`${this.endpoint}/${id_banco}/nombre/${nombre}`);
    }

    getClientesByTipo(id_banco: string, tipoCliente: string): Observable<Cliente[]> {
        return this.apiService.get<Cliente[]>(`${this.endpoint}/${id_banco}/tipo/${tipoCliente}`);
    }

    getClientesByDetalle(id_banco: string, detalleTipo: string): Observable<Cliente[]> {
        return this.apiService.get<Cliente[]>(`${this.endpoint}/${id_banco}/detalle/${detalleTipo}`);
    }

    getClientesByVetado(id_banco: string, vetado: boolean): Observable<Cliente[]> {
        return this.apiService.get<Cliente[]>(`${this.endpoint}/${id_banco}/vetado/${vetado}`);
    }
}
