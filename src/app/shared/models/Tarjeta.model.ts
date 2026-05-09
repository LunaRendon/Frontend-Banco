/**
 * Modelo para la entidad Tarjeta
 */
export interface Tarjeta {
    id_tarjeta: string;
    id: string; // Alias

    numero_tarjeta: string;
    tipo_tarjeta: string;

    fecha_vencimiento: string;

    estado: boolean;

    id_cuenta: string;

    fecha_creacion?: string;
    fecha_edicion?: string;
}

/**
 * Modelo para crear una nueva tarjeta
 */
export interface CreateTarjetaRequest {
    numero_tarjeta: string;
    tipo_tarjeta: string;

    fecha_vencimiento: string;

    cvv: string;

    estado: boolean;

    id_cuenta: string;
}

/**
 * Modelo para actualizar una tarjeta
 */
export interface UpdateTarjetaRequest {
    numero_tarjeta?: string;

    tipo_tarjeta?: string;

    fecha_vencimiento?: string;

    cvv?: string;

    estado?: boolean;

    id_cuenta?: string;
}

/**
 * Modelo para filtros de búsqueda de tarjetas
 */
export interface TarjetaFilters {
    numero_tarjeta?: string;

    tipo_tarjeta?: string;

    estado?: boolean;

    id_cuenta?: string;
}

/**
 * Modelo para respuesta paginada de tarjetas
 */
export interface TarjetaListResponse {
    data: Tarjeta[];

    totalPages: number;

    currentPage: number;

    totalItems: number;
}