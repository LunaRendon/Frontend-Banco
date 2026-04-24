import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Banco, BancoFilters, CreateBancoRequest, UpdateBancoRequest } from '../../shared/models/Banco.model';
import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BancoService {
  private readonly endpoint = 'bancos';

  constructor(private apiService: ApiService) { }

  getBancos(pagination: PaginationParams, filters?: BancoFilters): Observable<Banco[]> {
    return this.apiService.getPaginated<Banco>(this.endpoint, pagination, filters);
  }


  getBancoById(id: string): Observable<Banco> {
    return this.apiService.get<Banco>(`${this.endpoint}/${id}`);
  }


  createBanco(banco: CreateBancoRequest): Observable<Banco> {
    return this.apiService.post<Banco>(this.endpoint, banco);
  }

 
  updateBanco(id: string, banco: UpdateBancoRequest): Observable<Banco> {
    return this.apiService.put<Banco>(`${this.endpoint}/${id}`, banco);
  }

  
  deleteBanco(id: string): Observable<any> {
    return this.apiService.delete<any>(`${this.endpoint}/${id}`);
  }

  
  getBancoByNombre(nombre: string): Observable<Banco> {
    return this.apiService.get<Banco>(`${this.endpoint}/nombre/${nombre}`);
  }

  
}
