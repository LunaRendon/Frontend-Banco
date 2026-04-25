import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuenta, CuentaFilters, CreateCuentaRequest, UpdateCuentaRequest } from '../../shared/models/Cuenta.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private readonly endpoint = 'cuentas';
  private apiUrl = 'http://127.0.0.1:8000/docs#/cuentas';
  constructor(private apiService: ApiService) { }

  getCuentas(pagination: PaginationParams, filters?: CuentaFilters): Observable<Cuenta[]> {
    return this.apiService.getPaginated<Cuenta>(this.endpoint, pagination, filters);
  }


  getCuentaById(id: string): Observable<Cuenta> {
    return this.apiService.get<Cuenta>(`${this.endpoint}/${id}`);
  }


  createCuenta(cuenta: CreateCuentaRequest): Observable<Cuenta> {
    return this.apiService.post<Cuenta>(this.endpoint, cuenta);
  }

 
  updateCuenta(id: string, cuenta: UpdateCuentaRequest): Observable<Cuenta> {
    return this.apiService.put<Cuenta>(`${this.endpoint}/${id}`, cuenta);
  }

  
  deleteCuenta(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  
  getCuentaByNombre(nombre: string): Observable<Cuenta> {
    return this.apiService.get<Cuenta>(`${this.endpoint}/nombre/${nombre}`);
  }

  
}
