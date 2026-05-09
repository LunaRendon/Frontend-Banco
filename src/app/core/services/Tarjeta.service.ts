import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Tarjeta,
    TarjetaFilters,
    CreateTarjetaRequest,
    UpdateTarjetaRequest
} from '../../shared/models/Tarjeta.model';

import { PaginationParams } from '../models/api-response.models';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class TarjetaService {
    private readonly endpoint = 'tarjetas';

    constructor(private apiService: ApiService) {}

    /**
     * Obtener todas las tarjetas
     */
    getTarjetas(
        pagination: PaginationParams,
        filters?: TarjetaFilters
    ): Observable<Tarjeta[]> {
        return this.apiService.getPaginated<Tarjeta>(
            this.endpoint,
            pagination,
            filters
        );
    }

    /**
     * Obtener tarjetas por cuenta
     */
    getTarjetasByCuenta(
        idCuenta: string,
        pagination?: PaginationParams
    ): Observable<Tarjeta[]> {
        return this.apiService.get<Tarjeta[]>(
            `${this.endpoint}/${idCuenta}`,
            pagination
        );
    }

    /**
     * Obtener tarjeta por ID
     */
    getTarjetaById(
        idCuenta: string,
        idTarjeta: string
    ): Observable<Tarjeta> {
        return this.apiService.get<Tarjeta>(
            `${this.endpoint}/${idCuenta}/tarjeta/${idTarjeta}`
        );
    }

    /**
     * Crear tarjeta
     */
    createTarjeta(
        tarjeta: CreateTarjetaRequest
    ): Observable<Tarjeta> {
        return this.apiService.post<Tarjeta>(
            this.endpoint,
            tarjeta
        );
    }

    /**
     * Actualizar tarjeta
     */
    updateTarjeta(
        idCuenta: string,
        idTarjeta: string,
        tarjeta: UpdateTarjetaRequest
    ): Observable<Tarjeta> {
        return this.apiService.put<Tarjeta>(
            `${this.endpoint}/${idCuenta}/tarjeta/${idTarjeta}`,
            tarjeta
        );
    }

    /**
     * Eliminar tarjeta
     */
    deleteTarjeta(
        idCuenta: string,
        idTarjeta: string
    ): Observable<any> {
        return this.apiService.delete<any>(
            `${this.endpoint}/${idCuenta}/tarjeta/${idTarjeta}`
        );
    }

    /**
     * Buscar tarjetas por número
     */
    getTarjetasByNumero(
        idCuenta: string,
        numeroTarjeta: string
    ): Observable<Tarjeta[]> {
        return this.apiService.get<Tarjeta[]>(
            `${this.endpoint}/${idCuenta}/numero/${numeroTarjeta}`
        );
    }

    /**
     * Buscar tarjetas por tipo
     */
    getTarjetasByTipo(
        idCuenta: string,
        tipoTarjeta: string
    ): Observable<Tarjeta[]> {
        return this.apiService.get<Tarjeta[]>(
            `${this.endpoint}/${idCuenta}/tipo/${tipoTarjeta}`
        );
    }

    /**
     * Buscar tarjetas por estado
     */
    getTarjetasByEstado(
        idCuenta: string,
        estado: boolean
    ): Observable<Tarjeta[]> {
        return this.apiService.get<Tarjeta[]>(
            `${this.endpoint}/${idCuenta}/estado/${estado}`
        );
    }
}