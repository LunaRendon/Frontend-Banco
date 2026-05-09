/**
 * Modelo para la entidad Prestamo
 */
export interface Prestamo {
    id_prestamo: string;

    monto: number;
    interes: number;
    cuotas: number;
    estado: string;

    fecha_inicio: string;
    fecha_fin?: string;

    id_cliente: string;
    id_cuenta: string;

    fecha_creacion: string;
    fecha_edicion?: string;

    cliente?: {
        nombre: string;
    };

    cuenta?: {
        numero_cuenta: string;
    };
}

/**
 * Modelo para crear un nuevo préstamo
 */
export interface CreatePrestamoRequest {
    monto: number;
    interes: number;
    cuotas: number;
    estado?: string;

    fecha_inicio: string;
    fecha_fin?: string;

    id_cliente: string;
    id_cuenta: string;
}

/**
 * Modelo para actualizar un préstamo
 */
export interface UpdatePrestamoRequest {
    monto?: number;
    interes?: number;
    cuotas?: number;
    estado?: string;

    fecha_inicio?: string;
    fecha_fin?: string;

    id_cliente?: string;
    id_cuenta?: string;
}

/**
 * Modelo para filtros de préstamos
 */
export interface PrestamoFilters {
    estado?: string;
    id_cliente?: string;
    id_cuenta?: string;
}

/**
 * Modelo para respuesta paginada de préstamos
 */
export interface PrestamoListResponse {
    data: Prestamo[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}