/**
 * Modelo para la entidad Cuenta
 */
export interface Cuenta {
    id_cuenta: string;
    numero_cuenta: string;
    tipo_cuenta: string;
    saldo: number;
    fecha_apertura: string;
    estado: boolean;
    id_cliente: string;
    fecha_creacion: string;
    fecha_edicion?: string;
    cliente?: { id_cliente: string; nombre: string };
    banco?: { id_banco: string; nombre: string };
}

export interface CreateCuentaRequest {
    numero_cuenta: string;
    tipo_cuenta: string;
    saldo: number;
    fecha_apertura: string;
    estado: boolean;
    id_cliente: string;
}

export interface UpdateCuentaRequest {
    numero_cuenta?: string;
    tipo_cuenta?: string;
    saldo?: number;
    estado?: boolean;
}

export interface CuentaFilters {
    tipo_cuenta?: string;
    estado?: boolean;
}

export interface CuentaListResponse {
    data: Cuenta[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}