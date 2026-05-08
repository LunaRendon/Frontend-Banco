import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Prestamo,
    PrestamoFilters,
    CreatePrestamoRequest,
    UpdatePrestamoRequest
} from 'src/app/shared/models/Prestamos.model';

import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class PrestamoService {

    private readonly endpoint = 'prestamos';

    constructor(private apiService: ApiService) { }

    getPrestamos(
        pagination: PaginationParams,
        filters?: PrestamoFilters
    ): Observable<Prestamo[]> {

        return this.apiService.getPaginated<Prestamo>(
            this.endpoint,
            pagination,
            filters
        );
    }

    getPrestamoById(id_prestamo: string): Observable<Prestamo> {

        return this.apiService.get<Prestamo>(
            `${this.endpoint}/${id_prestamo}`
        );
    }

    createPrestamo(
        prestamo: CreatePrestamoRequest
    ): Observable<Prestamo> {

        return this.apiService.post<Prestamo>(
            this.endpoint,
            prestamo
        );
    }

    updatePrestamo(
        id_prestamo: string,
        prestamo: UpdatePrestamoRequest
    ): Observable<Prestamo> {

        return this.apiService.put<Prestamo>(
            `${this.endpoint}/${id_prestamo}`,
            prestamo
        );
    }

    deletePrestamo(id_prestamo: string): Observable<any> {

        return this.apiService.delete<any>(
            `${this.endpoint}/${id_prestamo}`
        );
    }

    getPrestamosByEstado(
        estado: string
    ): Observable<Prestamo[]> {

        return this.apiService.get<Prestamo[]>(
            `${this.endpoint}/estado/${estado}`
        );
    }

    getPrestamosByCliente(
        id_cliente: string
    ): Observable<Prestamo[]> {

        return this.apiService.get<Prestamo[]>(
            `${this.endpoint}/cliente/${id_cliente}`
        );
    }

    getPrestamosByCuenta(
        id_cuenta: string
    ): Observable<Prestamo[]> {

        return this.apiService.get<Prestamo[]>(
            `${this.endpoint}/cuenta/${id_cuenta}`
        );
    }
}