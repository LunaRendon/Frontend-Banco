/**
 * Modelo para la entidad Cuenta
 */
export interface Cuenta {
    id: string;
    nombre: string;
    tipo: string;
    saldo: number;
    fecha_creacion: string;
    fecha_edicion?: string;
}

/**
 * Modelo para crear una nueva cuenta
 */
export interface CreateCuentaRequest {
    nombre: string;
    tipo: string;
    saldo: number;
}

/**
 * Modelo para actualizar una cuenta
 */
export interface UpdateCuentaRequest {
    nombre?: string;
    tipo?: string;
    saldo?: number;
}

/**
 * Modelo para filtros de cuenta
 */
export interface CuentaFilters {
    nombre?: string;
    tipo?: string;
}

/**
 * Modelo para respuesta paginada de cuentas
 */
export interface CuentaListResponse {
    data: Cuenta[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

/** * Modelo para crear una nueva cuenta

 */
export interface CreateCuentaRequest {
    nombre: string;
    tipo: string;
    saldo: number;
}

/**
 * Modelo para actualizar una cuenta
 */
export interface UpdateCuentaRequest {
    nombre?: string;
    tipo?: string;
    saldo?: number;
}

/**
 * Modelo para filtros de cuenta
 */
export interface CuentaFilters {
    nombre?: string;
    tipo?: string;
}

/**
 * Modelo para respuesta paginada de cuentas
 */
export interface CuentaListResponse {
    data: Cuenta[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}
