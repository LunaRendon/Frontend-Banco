import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cuenta, CreateCuentaRequest, UpdateCuentaRequest } from '../../shared/models/Cuenta.model';
import { ApiService } from './api.service';
import { environment } from 'src/environments/enviroment';

@Injectable({
    providedIn: 'root'
})
export class CuentaService {
    private readonly endpoint = 'cuentas';
    private apiUrl = environment.apiUrl;

    constructor(private apiService: ApiService, private http: HttpClient) {}

    getCuentasByCliente(id_cliente: string): Observable<Cuenta[]> {
        return this.http.get<Cuenta[]>(`${this.apiUrl}${this.endpoint}/${id_cliente}`);
    }

    getCuentaById(id_cliente: string, id_cuenta: string): Observable<Cuenta> {
        return this.http.get<Cuenta>(`${this.apiUrl}${this.endpoint}/${id_cliente}/cuenta/${id_cuenta}`);
    }

    createCuenta(cuenta: CreateCuentaRequest): Observable<Cuenta> {
        return this.apiService.post<Cuenta>(this.endpoint, cuenta);
    }

    updateCuenta(id_cliente: string, id_cuenta: string, cuenta: UpdateCuentaRequest): Observable<Cuenta> {
        return this.http.put<Cuenta>(`${this.apiUrl}${this.endpoint}/${id_cliente}/Cuenta/${id_cuenta}`, cuenta);
    }

    deleteCuenta(id_cliente: string, id_cuenta: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}${this.endpoint}/${id_cliente}/Cuenta/${id_cuenta}`);
    }
}